// Home Tender — contas locais.
// As contas ficam neste aparelho (localStorage). A senha nunca é guardada:
// guardamos só um hash PBKDF2-SHA256 com sal aleatório.
// Não é autenticação de servidor: serve para separar perfis e o "Meu Bar" de cada pessoa
// no mesmo aparelho. Para login entre aparelhos seria preciso um serviço de backend.

import {getLang} from './i18n.js';

const MSG = {
  name: ['Diga como devemos chamar você.', 'Tell us what to call you.', 'Dinos cómo llamarte.'],
  email: ['Confira o e-mail.', 'Check the email address.', 'Revisa el correo.'],
  short: ['A senha precisa ter ao menos 6 caracteres.', 'The password must have at least 6 characters.', 'La contraseña debe tener al menos 6 caracteres.'],
  exists: ['Já existe uma conta com esse e-mail neste aparelho. Entre com a sua senha.', 'An account with this email already exists on this device. Sign in with your password.', 'Ya existe una cuenta con ese correo en este dispositivo. Entra con tu contraseña.'],
  save: ['Não foi possível salvar a conta (navegação privada?).', 'Could not save the account (private browsing?).', 'No se pudo guardar la cuenta (¿navegación privada?).'],
  wrong: ['E-mail ou senha incorretos.', 'Incorrect email or password.', 'Correo o contraseña incorrectos.'],
  crypto: ['Este navegador não oferece criptografia segura. Abra o app pelo endereço https.', 'This browser lacks secure cryptography. Open the app over https.', 'Este navegador no ofrece criptografía segura. Abre la app por https.']
};
const msg = k => MSG[k][{pt: 0, en: 1, es: 2}[getLang()] ?? 0];

const USERS_KEY = 'hometender.users';
const SESSION_KEY = 'hometender.session';
const ITERATIONS = 150000;

const enc = new TextEncoder();
const toHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const fromHex = hex => new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));

export const normalizeEmail = email => String(email || '').trim().toLowerCase();
export const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));

async function hashPassword(password, saltHex, iterations = ITERATIONS) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error(msg('crypto'));
  const key = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations}, key, 256);
  return toHex(bits);
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Cria o gerenciador de contas sobre um armazenamento com getItem/setItem/removeItem. */
export function createAuth(storage = globalThis.localStorage) {
  const read = (key, fallback) => { try { const v = storage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
  const write = (key, value) => { try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };

  return {
    current() {
      const s = read(SESSION_KEY, null);
      if (!s) return null;
      const user = read(USERS_KEY, {})[s.email];
      return user ? {email: s.email, name: user.name} : null;
    },

    async register({name, email, password}) {
      name = String(name || '').trim();
      email = normalizeEmail(email);
      if (name.length < 2) throw new Error(msg('name'));
      if (!validEmail(email)) throw new Error(msg('email'));
      if (String(password || '').length < 6) throw new Error(msg('short'));
      const users = read(USERS_KEY, {});
      if (users[email]) throw new Error(msg('exists'));
      const salt = toHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
      users[email] = {name, salt, iterations: ITERATIONS, hash: await hashPassword(password, salt), created: new Date().toISOString()};
      if (!write(USERS_KEY, users)) throw new Error(msg('save'));
      write(SESSION_KEY, {email});
      return {email, name};
    },

    async login({email, password}) {
      email = normalizeEmail(email);
      const user = read(USERS_KEY, {})[email];
      // Mesma mensagem para e-mail inexistente e senha errada
      const fail = new Error(msg('wrong'));
      if (!user) { await hashPassword(String(password || ''), '00'.repeat(16)); throw fail; }
      const hash = await hashPassword(String(password || ''), user.salt, user.iterations || ITERATIONS);
      if (!safeEqual(hash, user.hash)) throw fail;
      write(SESSION_KEY, {email});
      return {email, name: user.name};
    },

    logout() { try { storage.removeItem(SESSION_KEY); } catch { /* nada */ } },

    hasAccounts() { return Object.keys(read(USERS_KEY, {})).length > 0; }
  };
}

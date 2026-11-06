// Home Tender — contas locais.
// As contas ficam neste aparelho (localStorage). A senha nunca é guardada:
// guardamos só um hash PBKDF2-SHA256 com sal aleatório.
// Não é autenticação de servidor: serve para separar perfis e o "Meu Bar" de cada pessoa
// no mesmo aparelho. Para login entre aparelhos seria preciso um serviço de backend.

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
  if (!subtle) throw new Error('Este navegador não oferece criptografia segura. Abra o app pelo endereço https.');
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
      if (name.length < 2) throw new Error('Diga como devemos chamar você.');
      if (!validEmail(email)) throw new Error('Confira o e-mail.');
      if (String(password || '').length < 6) throw new Error('A senha precisa ter ao menos 6 caracteres.');
      const users = read(USERS_KEY, {});
      if (users[email]) throw new Error('Já existe uma conta com esse e-mail neste aparelho. Entre com a sua senha.');
      const salt = toHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
      users[email] = {name, salt, iterations: ITERATIONS, hash: await hashPassword(password, salt), created: new Date().toISOString()};
      if (!write(USERS_KEY, users)) throw new Error('Não foi possível salvar a conta (navegação privada?).');
      write(SESSION_KEY, {email});
      return {email, name};
    },

    async login({email, password}) {
      email = normalizeEmail(email);
      const user = read(USERS_KEY, {})[email];
      // Mesma mensagem para e-mail inexistente e senha errada
      const fail = new Error('E-mail ou senha incorretos.');
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

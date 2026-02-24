// Script para migrar database - remover username e adicionar email
const pool = require('./db/pool');

const migrateDatabase = async () => {
  try {
    console.log('🔄 Iniciando migração do database...');

    // 1. Verificar se tabela existe e se tem username
    const checkTable = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username'
    `);

    if (checkTable.rows.length > 0) {
      console.log('⚠️ Encontrado coluna username, iniciando migração...');

      // 2. Remover constraint de unique username se existir
      await pool.query(`
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key
      `);
      console.log('✅ Removido constraint username');

      // 3. Adicionar coluna email (se não existir)
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100)
      `);
      console.log('✅ Adicionado coluna email');

      // 4. Copiar dados de username para email (se não tiver)
      await pool.query(`
        UPDATE users SET email = username WHERE email IS NULL
      `);
      console.log('✅ Dados copiados de username para email');

      // 5. Fazer email UNIQUE
      await pool.query(`
        ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email)
      `);
      console.log('✅ Email constraint adicionado');

      // 6. Remover coluna username
      await pool.query(`
        ALTER TABLE users DROP COLUMN username
      `);
      console.log('✅ Coluna username removida');

      console.log('✨ Migração concluída com sucesso!');
    } else {
      console.log('✅ Database já está com estrutura correta (email)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  }
};

migrateDatabase();

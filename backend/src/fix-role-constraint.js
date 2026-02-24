// Script para corrigir constraint de role
const pool = require('./db/pool');

const fixRoleConstraint = async () => {
  try {
    console.log('🔧 Corrigindo constraint de role...\n');
    
    // 1. Remover constraint antigo
    console.log('1️⃣  Removendo constraint antigo...');
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check
    `);
    console.log('✅ Constraint removido');
    
    // 2. Adicionar novo constraint com "customer"
    console.log('\n2️⃣  Adicionando novo constraint...');
    await pool.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'kasir', 'customer'))
    `);
    console.log('✅ Novo constraint adicionado');
    
    // 3. Verificar constraint
    console.log('\n3️⃣  Verificando constraint...');
    const roleResult = await pool.query(`
      SELECT DISTINCT role FROM users ORDER BY role
    `);
    
    console.log('Valores de role permitidos agora: admin, kasir, customer');
    
    console.log('\n✨ Constraint corrigido com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixRoleConstraint();

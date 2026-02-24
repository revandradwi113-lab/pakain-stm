// Script para verificar constraints
const pool = require('./db/pool');

const checkConstraints = async () => {
  try {
    console.log('🔍 Verificando constraints da tabela users...\n');
    
    // Mostrar todos os dados de um usuario existente
    const userResult = await pool.query(`
      SELECT * FROM users LIMIT 1
    `);
    
    if (userResult.rows.length > 0) {
      console.log('Exemplo de usuário existente:');
      console.log(JSON.stringify(userResult.rows[0], null, 2));
    }
    
    // Mostrar valores únicos de role
    console.log('\n📋 Valores de role na tabela:');
    const roleResult = await pool.query(`
      SELECT DISTINCT role FROM users
    `);
    
    roleResult.rows.forEach(row => {
      console.log(`  - ${row.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkConstraints();

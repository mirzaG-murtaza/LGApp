db.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: [
      { role: 'readWrite', db: 'your_database_name' }
    ]
  });
  
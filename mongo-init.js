db.createUser({
    user: 'admin',
    pwd: 'mavericks123',
    roles: [
      { role: 'readWrite', db: 'mongodb' }
    ]
  });
  
CREATE DATABASE floricoop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE floricoop;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  rol ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  minimo INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuarios iniciales
INSERT INTO usuarios (nombre, rol) VALUES
('Bastian', 'admin'),
('Guillermo', 'user');

-- Productos iniciales
INSERT INTO productos (nombre, stock, minimo) VALUES
('Rosa', 25, 5),
('Clavel', 40, 10),
('Tulipán', 15, 3);


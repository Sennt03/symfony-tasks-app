# Task App - Symfony

Este proyecto es una aplicación en **Symfony** para crear tareas (CRUD)  
A continuación encontrarás las instrucciones para instalar y ejecutar la aplicación tanto manualmente como con Docker.

---

## Requisitos previos

Para ejecutar la aplicación manualmente necesitas:

- PHP >= 8.2
- Composer  
- Symfony CLI
- MySQL o MariaDB  
- Apache (puede usarse XAMPP, WAMP, Laragon o similar)  
- Extensiones PHP requeridas por Symfony (`pdo_mysql`, `intl`, `mbstring`, `ctype`, `tokenizer`, `xml`)

Si deseas ejecutar con Docker, solo necesitas **Docker** y **Docker Compose** instalados y en ejecución.

---

## Instalación manual

**Asegurate tener xampp (o el servicio que prefieras) ejecutando mysql**

1. Clona este repositorio en tu máquina:
   git clone https://github.com/Sennt03/symfony-tasks-app
   cd symfony-tasks-app

2. Instala las dependencias con Composer:
   composer install

3. Copia el archivo de entorno (crea archivo .env y copia el contenido de .env.example):
   cp .env.example .env

4. Configura tu base de datos en `.env`, ejemplo:
   DATABASE_URL="mysql://root:@127.0.0.1:3306/task_app_prueba?serverVersion=8.0"

5. Ejecuta las migraciones:
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate

6. Inicia el servidor local de Symfony:
   symfony server:start

7. Abre en tu navegador:
   http://127.0.0.1:8000

**Nota:** Si usas XAMPP, no necesitas tener Apache encendido para usar `symfony server:start`, ya que Symfony trae su propio servidor local.  
El Apache de XAMPP solo es necesario si deseas servir la aplicación directamente desde `htdocs`.

---

## Instalación con Docker
**Asegurate no tener nada prendido en los puertos 8000 (app) y 3306 (mysql)**

Si prefieres no instalar nada manualmente:

1. Asegúrate de tener **Docker** y **Docker Compose** en ejecución.

2. Clona este repositorio:
   git clone https://github.com/Sennt03/symfony-tasks-app
   cd symfony-tasks-app

3. Construye y levanta los contenedores:
   docker-compose -f docker-compose.yaml up --build

   - Cuando finalice hasta las migraciones estara lista tu app para usar en http://localhost:8000
   ```bash
   task-app     | 2025-10-01 22:43:26,168 INFO exited: migrations (exit status 0; expected)
   ```

4. Abre en tu navegador:
   http://localhost:8080
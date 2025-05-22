import os
import subprocess
from datetime import datetime
from flask import send_file, request, jsonify, current_app, flash, redirect, url_for
from werkzeug.utils import secure_filename
from flask import Blueprint
from flask_login import login_required

backup_restore_bp = Blueprint('backup_restore', __name__)

# Connection parameters (customize for your environment)
SERVER = 'localhost'
DATABASE = 'sadprojectdb'
USERNAME = 'root'
PASSWORD = 'password'
BACKUP_DIR = 'C:/Users/user/Desktop/SADWEBAPP/backup'

MYSQL_BIN = r'C:\Program Files\MySQL\MySQL Server 8.0\bin'
MYSQLDUMP_PATH = os.path.join(MYSQL_BIN, 'mysqldump.exe')
MYSQL_PATH = os.path.join(MYSQL_BIN, 'mysql.exe')

@backup_restore_bp.route('/admin/backup', methods=['GET'])
def backup_database():
    try:
        from io import BytesIO
        from sqlalchemy import create_engine, MetaData
        import os
        # Use your cloud DB URI
        db_uri = os.environ.get('DATABASE_URL')
        engine = create_engine(db_uri)
        meta = MetaData()
        meta.reflect(bind=engine)
        output = BytesIO()
        for table in meta.sorted_tables:
            rows = engine.execute(table.select()).fetchall()
            if not rows:
                continue
            # Write CREATE TABLE and INSERT statements
            output.write(f'-- Table: {table.name}\n'.encode())
            for row in rows:
                values = ', '.join([repr(str(v)) if v is not None else 'NULL' for v in row])
                output.write(f'INSERT INTO {table.name} VALUES ({values});\n'.encode())
        output.seek(0)
        return send_file(output, as_attachment=True, download_name='backup.sql', mimetype='text/sql')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@backup_restore_bp.route('/admin/restore', methods=['POST'])
@login_required
def restore_database():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        # Only allow .sql files
        if not filename.lower().endswith('.sql'):
            return jsonify({'error': 'Only .sql files are allowed.'}), 400
        # Limit file size (e.g. 5MB)
        file.seek(0, os.SEEK_END)
        size = file.tell()
        if size > 5 * 1024 * 1024:
            return jsonify({'error': 'File too large. Max 5MB.'}), 400
        file.seek(0)
        # Use a cloud-friendly directory for uploads
        upload_dir = '/tmp'  # or './uploads' if you want it in your project
        os.makedirs(upload_dir, exist_ok=True)
        restore_path = os.path.join(upload_dir, filename)
        file.save(restore_path)
        try:
            # Disable foreign key checks
            subprocess.run([
                MYSQL_PATH,
                '-u', USERNAME,
                f'-p{PASSWORD}',
                DATABASE,
                '-e', 'SET FOREIGN_KEY_CHECKS = 0;'
            ], stderr=subprocess.PIPE, shell=False)
            # Restore DB
            with open(restore_path, 'r', encoding='utf-8') as f:
                result = subprocess.run([
                    MYSQL_PATH,
                    '-u', USERNAME,
                    f'-p{PASSWORD}',
                    DATABASE
                ], stdin=f, stderr=subprocess.PIPE, shell=False)
            # Re-enable foreign key checks
            subprocess.run([
                MYSQL_PATH,
                '-u', USERNAME,
                f'-p{PASSWORD}',
                DATABASE,
                '-e', 'SET FOREIGN_KEY_CHECKS = 1;'
            ], stderr=subprocess.PIPE, shell=False)
        except Exception as e:
            return jsonify({'error': f'Restore failed: {str(e)}'}), 500
        if result.returncode != 0:
            return jsonify({'error': result.stderr.decode()}), 500
        flash('Database restored successfully!', 'success')
        return redirect(url_for('views.admin_dashboard'))  # Change to your admin dashboard route name if different
    except Exception as e:
        return jsonify({'error': str(e)}), 500

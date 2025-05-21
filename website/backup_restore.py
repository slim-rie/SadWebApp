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
@login_required
def backup_database():
    backup_file = f"{DATABASE}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
    backup_path = os.path.join(BACKUP_DIR, backup_file)
    try:
        with open(backup_path, 'w', encoding='utf-8') as f:
            result = subprocess.run([
                MYSQLDUMP_PATH,
                '-u', USERNAME,
                f'-p{PASSWORD}',
                DATABASE
            ], stdout=f, stderr=subprocess.PIPE, shell=False)
        if result.returncode != 0:
            return jsonify({'error': result.stderr.decode()}), 500
        return send_file(backup_path, as_attachment=True)
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
        restore_path = os.path.join(BACKUP_DIR, filename)
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

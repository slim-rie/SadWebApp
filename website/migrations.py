from . import db
from .models import Product, Category, Supplier

def init_db():
    db.create_all()
    
    # Add categories if they don't exist
    if not Category.query.first():
        categories = [
            {
                'name': 'Fabric',
                'description': 'High-quality fabrics for all your sewing needs'
            },
            {
                'name': 'Sewing Parts',
                'description': 'Essential parts and accessories for sewing machines'
            },
            {
                'name': 'Sewing Machines',
                'description': 'Professional sewing machines for all purposes'
            }
        ]
        
        for cat_data in categories:
            category = Category(**cat_data)
            db.session.add(category)
        db.session.commit()
    
    # Add suppliers if they don't exist
    if not Supplier.query.first():
        suppliers = [
            {
                'name': 'FabricWorld Co.',
                'contact_info': 'contact@fabricworld.com',
                'address': '123 Textile Street, Fabric City'
            },
            {
                'name': 'SewingPro Parts',
                'contact_info': 'info@sewingproparts.com',
                'address': '456 Machine Avenue, Parts Town'
            },
            {
                'name': 'MachineMax Industries',
                'contact_info': 'sales@machinemax.com',
                'address': '789 Industrial Road, Machine City'
            }
        ]
        
        for supp_data in suppliers:
            supplier = Supplier(**supp_data)
            db.session.add(supplier)
        db.session.commit()
    
    # Add products if they don't exist
    if not Product.query.first():
        # Get category and supplier references
        fabric_cat = Category.query.filter_by(name='Fabric').first()
        parts_cat = Category.query.filter_by(name='Sewing Parts').first()
        machines_cat = Category.query.filter_by(name='Sewing Machines').first()
        
        fabric_supplier = Supplier.query.filter_by(name='FabricWorld Co.').first()
        parts_supplier = Supplier.query.filter_by(name='SewingPro Parts').first()
        machines_supplier = Supplier.query.filter_by(name='MachineMax Industries').first()
        
        sample_products = [
            {
                'name': 'Chiffon Purple',
                'description': 'High-quality purple chiffon fabric',
                'price': 15.99,
                'image_url': '/static/pictures/Chiffon Purple.jpg',
                'stock': 100,
                'category_id': fabric_cat.id,
                'supplier_id': fabric_supplier.id,
                'sku': 'FAB-CHIF-PUR-001',
                'unit_of_measure': 'meters'
            },
            {
                'name': 'Plain Chiffon Fabric',
                'description': 'Versatile plain chiffon fabric',
                'price': 12.99,
                'image_url': '/static/pictures/plain-chiffon-fabric.jpg',
                'stock': 150,
                'category_id': fabric_cat.id,
                'supplier_id': fabric_supplier.id,
                'sku': 'FAB-CHIF-PLN-001',
                'unit_of_measure': 'meters'
            },
            {
                'name': 'White Chiffon',
                'description': 'Pure white chiffon fabric',
                'price': 13.99,
                'image_url': '/static/pictures/White Chiffon.jpg',
                'stock': 120,
                'category_id': fabric_cat.id,
                'supplier_id': fabric_supplier.id,
                'sku': 'FAB-CHIF-WHT-001',
                'unit_of_measure': 'meters'
            },
            {
                'name': 'Foot Pedal',
                'description': 'Sewing machine foot pedal',
                'price': 29.99,
                'image_url': '/static/pictures/Foot Pedal.jpg',
                'stock': 50,
                'category_id': parts_cat.id,
                'supplier_id': parts_supplier.id,
                'sku': 'PRT-PDL-001',
                'unit_of_measure': 'pieces'
            },
            {
                'name': 'Gemsy Presser Foot',
                'description': 'Quick adjustable screw device presser foot',
                'price': 19.99,
                'image_url': '/static/pictures/Gemsy Presser Foot Quick Adjustable Screw Device Presser Foot.jpg',
                'stock': 75,
                'category_id': parts_cat.id,
                'supplier_id': parts_supplier.id,
                'sku': 'PRT-PRF-001',
                'unit_of_measure': 'pieces'
            },
            {
                'name': 'Singer Heavy Duty Sewing Machine',
                'description': 'Professional grade heavy duty sewing machine',
                'price': 299.99,
                'image_url': '/static/pictures/Vingate Singer Sewing Machine.jpg',
                'stock': 25,
                'category_id': machines_cat.id,
                'supplier_id': machines_supplier.id,
                'sku': 'MCH-SNG-001',
                'unit_of_measure': 'pieces'
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()

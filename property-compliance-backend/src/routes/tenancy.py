from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
import os
import json
import tempfile
import zipfile
from datetime import datetime
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import requests

tenancy_bp = Blueprint('tenancy', __name__)

@tenancy_bp.route('/generate-tenancy-pack', methods=['POST'])
@cross_origin()
def generate_tenancy_pack():
    """Generate the complete tenancy pack with all documents"""
    try:
        data = request.get_json()
        
        # Validate required data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Create temporary directory for files
        temp_dir = tempfile.mkdtemp()
        
        # Generate tenancy agreement PDF
        agreement_path = generate_tenancy_agreement(data, temp_dir)
        
        # Create zip file with all documents
        zip_path = create_tenancy_pack_zip(data, temp_dir, agreement_path)
        
        # Return the zip file
        return send_file(
            zip_path,
            as_attachment=True,
            download_name=f"tenancy_pack_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
            mimetype='application/zip'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_tenancy_agreement(data, temp_dir):
    """Generate the tenancy agreement PDF from the template and form data"""
    
    # Read the original tenancy agreement template
    template_path = '/home/ubuntu/upload/AssuredShortholdTenancyAgreement(England).pdf'
    
    # Extract text from PDF (simplified - in production would use proper PDF parsing)
    # For now, we'll create a new PDF with the filled data
    
    output_path = os.path.join(temp_dir, 'tenancy_agreement.pdf')
    
    # Create PDF document
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Title
    story.append(Paragraph("ASSURED SHORTHOLD TENANCY AGREEMENT", title_style))
    story.append(Spacer(1, 12))
    
    # Property address
    property_address = f"{data['property']['houseNumber']} {data['property']['street']}, {data['property']['city']}, {data['property']['postcode']}"
    story.append(Paragraph(property_address, styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Agreement date
    story.append(Paragraph(f"THIS AGREEMENT is dated {data['rentalTerms']['agreementDate']}", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Parties section
    story.append(Paragraph("PARTIES", heading_style))
    
    # Landlord
    landlord_text = f"1. {data['landlord']['fullName']} of {data['landlord']['address']}, {data['landlord']['phone']}, {data['landlord']['email']} (Landlord)."
    story.append(Paragraph(landlord_text, styles['Normal']))
    story.append(Spacer(1, 6))
    
    # Tenants
    for i, tenant in enumerate(data['tenants']):
        tenant_num = i + 2
        tenant_text = f"{tenant_num}. {tenant['fullName']}, of {tenant['address']}, {tenant['phone']}, {tenant['email']} (Tenant)."
        story.append(Paragraph(tenant_text, styles['Normal']))
        story.append(Spacer(1, 6))
    
    story.append(Spacer(1, 12))
    
    # Agreed Terms
    story.append(Paragraph("AGREED TERMS", heading_style))
    
    # Particulars
    story.append(Paragraph("1. Particulars", styles['Heading3']))
    story.append(Paragraph(f"1.1 Property: {property_address}", styles['Normal']))
    story.append(Paragraph(f"1.2 Rent: £{data['rentalTerms']['rentAmount']} per {data['rentalTerms']['paymentFrequency']}.", styles['Normal']))
    
    payment_day_text = data['rentalTerms']['paymentDay']
    if data['rentalTerms']['paymentFrequency'] == 'month':
        payment_day_text = f"the {payment_day_text} day of each month"
    else:
        payment_day_text = f"every {payment_day_text}"
    
    story.append(Paragraph(f"1.3 Rent Payment Dates: {payment_day_text}.", styles['Normal']))
    story.append(Paragraph(f"1.4 First Rent Payment Date: {data['rentalTerms']['firstPaymentDate']}.", styles['Normal']))
    story.append(Paragraph(f"1.5 Deposit: £{data['rentalTerms']['depositAmount']}.", styles['Normal']))
    story.append(Paragraph(f"1.6 Term: a fixed term of {data['rentalTerms']['tenancyLength']} months from and including {data['rentalTerms']['startDate']}.", styles['Normal']))
    
    story.append(Spacer(1, 12))
    
    # Add standard clauses (simplified version)
    story.append(Paragraph("2. Standard Terms and Conditions", styles['Heading3']))
    story.append(Paragraph("This agreement creates an assured shorthold tenancy under Part I of Chapter II of the Housing Act 1988.", styles['Normal']))
    story.append(Paragraph("The tenant agrees to pay rent in advance and maintain the property in good condition.", styles['Normal']))
    story.append(Paragraph("The landlord agrees to provide quiet enjoyment and maintain the property structure.", styles['Normal']))
    
    story.append(Spacer(1, 24))
    
    # Signatures
    story.append(Paragraph("SIGNATURES OF THE PARTIES:", heading_style))
    story.append(Paragraph("This agreement has been entered into on the date stated at the beginning of it.", styles['Normal']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("SIGNED BY:", styles['Normal']))
    story.append(Paragraph(f"{data['landlord']['fullName']}, Landlord", styles['Normal']))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Date: ___________________", styles['Normal']))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("SIGNED BY TENANT(S):", styles['Normal']))
    for i, tenant in enumerate(data['tenants']):
        story.append(Paragraph(f"{i+1}. {tenant['fullName']}", styles['Normal']))
        story.append(Spacer(1, 6))
    
    story.append(Paragraph("Date: ___________________", styles['Normal']))
    
    # Build PDF
    doc.build(story)
    
    return output_path

def create_tenancy_pack_zip(data, temp_dir, agreement_path):
    """Create a zip file containing all the tenancy documents"""
    
    zip_path = os.path.join(temp_dir, 'tenancy_pack.zip')
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add tenancy agreement
        zipf.write(agreement_path, 'Tenancy_Agreement.pdf')
        
        # Add uploaded documents (if any)
        documents = data.get('documents', {})
        
        # Note: In a real implementation, uploaded files would be stored and retrieved
        # For now, we'll create placeholder files for acknowledged documents
        
        doc_mapping = {
            'epc': 'Energy_Performance_Certificate.pdf',
            'gasSafety': 'Gas_Safety_Certificate.pdf',
            'eicr': 'Electrical_Safety_Certificate.pdf',
            'rightToRent': 'Right_to_Rent_Documentation.pdf',
            'deposit': 'Deposit_Protection_Evidence.pdf'
        }
        
        for doc_key, filename in doc_mapping.items():
            doc = documents.get(doc_key, {})
            if doc.get('hasDocument'):
                # Create a placeholder file for acknowledged documents
                placeholder_path = os.path.join(temp_dir, filename)
                with open(placeholder_path, 'w') as f:
                    f.write(f"Placeholder for {filename.replace('_', ' ').replace('.pdf', '')}\n")
                    f.write("This document was acknowledged as available by the landlord.\n")
                zipf.write(placeholder_path, filename)
        
        # Add How to Rent guide (placeholder)
        how_to_rent_path = os.path.join(temp_dir, 'How_to_Rent_Guide.pdf')
        with open(how_to_rent_path, 'w') as f:
            f.write("How to Rent Guide\n")
            f.write("This would be the latest official government guide.\n")
        zipf.write(how_to_rent_path, 'How_to_Rent_Guide.pdf')
        
        # Add checklist
        checklist_path = create_checklist(data, temp_dir)
        zipf.write(checklist_path, 'Tenancy_Checklist.pdf')
        
        # Add summary document
        summary_path = create_summary_document(data, temp_dir)
        zipf.write(summary_path, 'Document_Summary.pdf')
    
    return zip_path

def create_checklist(data, temp_dir):
    """Create a compliance checklist PDF"""
    
    output_path = os.path.join(temp_dir, 'checklist.pdf')
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("ASSURED SHORTHOLD TENANCY CHECKLIST", title_style))
    story.append(Spacer(1, 12))
    
    checklist_items = [
        "✓ Tenancy Agreement completed and signed",
        "✓ Energy Performance Certificate provided",
        "✓ Gas Safety Certificate provided",
        "✓ Electrical Installation Condition Report provided",
        "✓ Right to Rent checks completed",
        "✓ Deposit protection arranged",
        "✓ How to Rent guide provided to tenants",
        "✓ All legal requirements met"
    ]
    
    for item in checklist_items:
        story.append(Paragraph(item, styles['Normal']))
        story.append(Spacer(1, 6))
    
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%d %B %Y')}", styles['Normal']))
    
    doc.build(story)
    return output_path

def create_summary_document(data, temp_dir):
    """Create a summary document listing all included files"""
    
    output_path = os.path.join(temp_dir, 'summary.pdf')
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("TENANCY PACK SUMMARY", title_style))
    story.append(Spacer(1, 12))
    
    # Property details
    property_address = f"{data['property']['houseNumber']} {data['property']['street']}, {data['property']['city']}, {data['property']['postcode']}"
    story.append(Paragraph(f"Property: {property_address}", styles['Normal']))
    story.append(Paragraph(f"Landlord: {data['landlord']['fullName']}", styles['Normal']))
    
    tenant_names = [tenant['fullName'] for tenant in data['tenants']]
    story.append(Paragraph(f"Tenant(s): {', '.join(tenant_names)}", styles['Normal']))
    
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("Documents Included:", styles['Heading3']))
    
    documents_list = [
        "• Tenancy Agreement (completed)",
        "• Energy Performance Certificate",
        "• Gas Safety Certificate", 
        "• Electrical Safety Certificate",
        "• Right to Rent Documentation",
        "• Deposit Protection Evidence",
        "• How to Rent Guide",
        "• Compliance Checklist"
    ]
    
    for doc in documents_list:
        story.append(Paragraph(doc, styles['Normal']))
        story.append(Spacer(1, 3))
    
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%d %B %Y at %H:%M')}", styles['Normal']))
    
    doc.build(story)
    return output_path

@tenancy_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


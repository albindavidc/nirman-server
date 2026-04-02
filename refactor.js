const fs = require('fs');
const path = require('path');

const replacements = {
  // Project
  'project_id': 'projectId',
  'manager_ids': 'managerIds',
  'start_date': 'startDate',
  'due_date': 'dueDate',
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'is_deleted': 'isDeleted',
  'deleted_at': 'deletedAt',
  
  // ProjectMember
  'user_id': 'userId',
  'is_creator': 'isCreator',
  'joined_at': 'joinedAt',

  // ProjectPhase
  'planned_start_date': 'plannedStartDate',
  'planned_end_date': 'plannedEndDate',
  'actual_start_date': 'actualStartDate',
  'actual_end_date': 'actualEndDate',

  // PhaseApproval
  'phase_id': 'phaseId',
  'approved_by': 'approvedBy',
  'requested_by': 'requestedBy',
  'approval_status': 'approvalStatus',
  'approved_at': 'approvedAt',
  'requested_at': 'requestedAt',

  // Attendance
  'check_in': 'checkIn',
  'check_out': 'checkOut',
  'work_hours': 'workHours',
  'supervisor_notes': 'supervisorNotes',
  'is_verified': 'isVerified',
  'verified_by': 'verifiedBy',
  'verified_at': 'verifiedAt',

  // Task
  'assigned_to': 'assignedTo',
  'estimated_hours': 'estimatedHours',
  'actual_hours': 'actualHours',

  // TaskDependency
  'successor_task_id': 'successorTaskId',
  'predecessor_task_id': 'predecessorTaskId',
  'lag_time': 'lagTime',

  // User
  'first_name': 'firstName',
  'last_name': 'lastName',
  'phone_number': 'phoneNumber',
  'is_phone_verified': 'isPhoneVerified',
  'is_email_verified': 'isEmailVerified',
  'date_of_birth': 'dateOfBirth',
  'password_hash': 'passwordHash',
  'profile_photo_url': 'profilePhotoUrl',
  'user_status': 'userStatus',

  // Material
  'material_name': 'materialName',
  'material_code': 'materialCode',
  'current_stock': 'currentStock',
  'unit_price': 'unitPrice',
  'reorder_level': 'reorderLevel',
  'storage_location': 'storageLocation',
  'preferred_supplier_id': 'preferredSupplierId',
  'created_by': 'createdBy',

  // MaterialTransaction
  'material_id': 'materialId',
  'reference_id': 'referenceId',
  'performed_by': 'performedBy',

  // MaterialRequest
  'request_number': 'requestNumber',
  'delivery_location': 'deliveryLocation',
  'required_date': 'requiredDate',
  'approval_comments': 'approvalComments',
  'rejection_reason': 'rejectionReason',
  'converted_to_po': 'convertedToPo',

  // Professional
  'professional_title': 'professionalTitle',
  'experience_years': 'experienceYears',
  'address_street': 'addressStreet',
  'address_city': 'addressCity',
  'address_state': 'addressState',
  'address_zip_code': 'addressZipCode',

  // Vendor
  'company_name': 'companyName',
  'registration_number': 'registrationNumber',
  'tax_number': 'taxNumber',
  'years_in_business': 'yearsInBusiness',
  'products_services': 'productsServices',
  'website_url': 'websiteUrl',
  'contact_email': 'contactEmail',
  'contact_phone': 'contactPhone',
  'vendor_status': 'vendorStatus'
};

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'generated' && f !== 'node_modules') {
        walk(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  for (let [snake, camel] of Object.entries(replacements)) {
    // Replace \b (word boundary) to match the property names exactly
    let regex = new RegExp(`\\b${snake}\\b`, 'g');
    content = content.replace(regex, camel);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Refactored: ${filePath}`);
  }
}

const targetDir = path.resolve(__dirname, 'src');
walk(targetDir, refactorFile);

console.log('Refactoring complete.');

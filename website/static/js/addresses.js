document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    document.getElementById('sidebarUsername').textContent = current_user.username || '';
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
        document.getElementById('profileImage').src = savedProfileImage;
    }
    
    var editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            window.location.href = 'myaccount.html';
        });
    }
    
    loadAddresses();
    
    document.getElementById('addNewAddressBtn').addEventListener('click', function() {
        openAddressModal('add');
    });
    
    const addressModal = document.getElementById('addressModal');
    var closeAddressModal = document.getElementById('closeAddressModal');
    if (closeAddressModal) {
        closeAddressModal.addEventListener('click', function() {
            addressModal.classList.remove('active');
        });
    }
    
    var cancelAddressModal = document.getElementById('cancelAddressModal');
    if (cancelAddressModal) {
        cancelAddressModal.addEventListener('click', function() {
            addressModal.classList.remove('active');
        });
    }
    
    var saveAddressModal = document.getElementById('saveAddressModal');
    if (saveAddressModal) {
        saveAddressModal.addEventListener('click', function() {
            saveAddress();
        });
    }
    
    var userIcon = document.getElementById('user-icon');
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
    
    setupLocationSelectionUI();
    
    let addressIdToDelete = null;

    function showDeleteModal(addressId) {
        addressIdToDelete = addressId;
        document.getElementById('deleteAddressModal').style.display = 'flex';
    }

    function hideDeleteModal() {
        addressIdToDelete = null;
        document.getElementById('deleteAddressModal').style.display = 'none';
    }

    if (document.getElementById('cancelDeleteBtn')) {
        document.getElementById('cancelDeleteBtn').onclick = hideDeleteModal;
    }
    if (document.getElementById('deleteAddressModal')) {
        document.getElementById('deleteAddressModal').onclick = function(e) {
            if (e.target === this) hideDeleteModal();
        };
    }
    if (document.getElementById('confirmDeleteBtn')) {
        document.getElementById('confirmDeleteBtn').onclick = function() {
            if (addressIdToDelete) {
                deleteAddress(addressIdToDelete);
                hideDeleteModal();
            }
        };
    }
});

function setupLocationSelectionUI() {
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownContent = document.getElementById('dropdownContent');
    const selectedLocation = document.getElementById('selectedLocation');
    const tabs = document.querySelectorAll('.tab');
    const locationLists = document.querySelectorAll('.location-list');
    
    const regionList = document.getElementById('regionList');
    const provinceList = document.getElementById('provinceList');
    const cityList = document.getElementById('cityList');
    const barangayList = document.getElementById('barangayList');
    
    const homeLabel = document.getElementById('homeLabel');
    const workLabel = document.getElementById('workLabel');
    const addressLabelInput = document.getElementById('addressLabel');
    
    const streetAddress = document.getElementById('streetAddress');
    const addressSuggestions = document.getElementById('addressSuggestions');
    
    const locationData = {
        provinces: {
                    northLuzon: ['Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales', 'Pangasinan', 'La Union', 'Ilocos Norte', 'Ilocos Sur', 'Cagayan', 'Isabela'],
                    ncr: ['Metro Manila'],
                    southLuzon: ['Laguna', 'Batangas', 'Cavite', 'Quezon', 'Rizal', 'Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Sorsogon'],
                    visayas: ['Cebu', 'Bohol', 'Leyte', 'Negros Occidental', 'Negros Oriental', 'Samar', 'Iloilo', 'Capiz', 'Aklan', 'Antique'],
                    mindanao: ['Davao del Sur', 'Davao del Norte', 'Zamboanga del Sur', 'Zamboanga del Norte', 'North Cotabato', 'South Cotabato', 'Bukidnon', 'Misamis Oriental', 'Misamis Occidental', 'Lanao del Norte', 'Lanao del Sur', 'Maguindanao', 'Sultan Kudarat']
                },
                cities: {
                    Bulacan: ['Bocaue', 'Malolos', 'Meycauayan', 'San Jose Del Monte', 'Balagtas', 'Bulacan', 'Calumpit', 'Guiguinto', 'Hagonoy', 'Marilao', 'Obando', 'Paombong', 'Plaridel', 'Pulilan', 'Santa Maria'],
                    Pampanga: ['Angeles', 'San Fernando', 'Mabalacat', 'Lubao', 'Apalit', 'Arayat', 'Bacolor', 'Candaba', 'Floridablanca', 'Guagua', 'Macabebe', 'Mexico', 'Porac', 'San Luis', 'San Simon', 'Santa Ana', 'Santa Rita'],
                    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Parañaque', 'Pasay', 'Caloocan', 'Las Piñas', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Valenzuela', 'San Juan', 'Pateros'],
                    Laguna: ['San Pedro', 'Biñan', 'Santa Rosa', 'Calamba', 'Los Baños', 'Cabuyao', 'Alaminos', 'Bay', 'Calauan', 'Famy', 'Kalayaan', 'Liliw', 'Luisiana', 'Lumban', 'Mabitac', 'Magdalena', 'Majayjay', 'Nagcarlan', 'Paete', 'Pagsanjan', 'Pakil', 'Pangil', 'Pila', 'Rizal', 'San Pablo', 'Santa Cruz', 'Victoria'],
                    Cebu: ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Toledo', 'Bogo', 'Carcar', 'Naga']
                },
                barangays: {
                    Bocaue: ['Lolomboy', 'Bunlo', 'Turo', 'Poblacion', 'Bagumbayan', 'Bambang', 'Batia', 'Biñang 1st', 'Biñang 2nd', 'Caingin', 'Duhat', 'Igulot', 'Sulucan', 'Taal', 'Tambobong', 'Wakas'],
                    Malolos: ['Balite', 'Caniogan', 'San Gabriel', 'Bulihan', 'Balete', 'Anilao', 'Atlag', 'Bagna', 'Balangkas', 'Bangkal', 'Barihan', 'Bungahan', 'Dakila', 'Guinhawa', 'Ligas', 'Longos', 'Lookban', 'Lugam', 'Mabolo', 'Malusak', 'Matimbo', 'Mojon', 'Namayan', 'Niugan', 'Panasahan', 'Pamarawan', 'Pinagbakahan', 'San Agustin', 'San Juan', 'San Pablo', 'San Vicente', 'Santiago', 'Santo Cristo', 'Santo Niño', 'Santo Rosario', 'Santisima Trinidad', 'Sumapang Bata', 'Sumapang Matanda', 'Taal', 'Tikay'],
                    'Quezon City': ['Alicia', 'Amihan', 'Apolonio Samson', 'Aurora', 'Baesa', 'Bagbag', 'Bagong Lipunan ng Crame', 'Bagong Pag-asa', 'Bagong Silangan', 'Bagumbayan', 'Bahay Toro', 'Balingasa', 'Balong Bato', 'Batasan Hills', 'Bayanihan', 'Blue Ridge A', 'Blue Ridge B', 'Botocan', 'Bungad', 'Camp Aguinaldo']
                }
    };
    
    const sampleAddresses = [
        "123 Maharlika Highway, Lolomboy",
        "456 San Jose St, Near Market",
        "789 Rizal Ave, Beside School",
        "101 Barangay Road, Near Church",
        "202 Commonwealth Blvd, Corner Store"
    ];
    
    let selection = {
        region: '',
        province: '',
        city: '',
        barangay: ''
    };
    
    dropdownToggle.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        const arrow = dropdownToggle.querySelector('.arrow');
        if (dropdownContent.classList.contains('active')) {
            arrow.textContent = '▲';
        } else {
            arrow.textContent = '▼';
        }
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            locationLists.forEach(list => list.style.display = 'none');
            document.getElementById(tabName + 'List').style.display = 'block';
        });
    });
    
    regionList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const regionValue = e.target.getAttribute('data-value');
            const regionName = e.target.textContent;
            
            selection.region = regionName;
            selection.province = '';
            selection.city = '';
            selection.barangay = '';
            currentSelection.region = regionName;
            currentSelection.province = '';
            currentSelection.city = '';
            currentSelection.barangay = '';
            
            updateSelectionDisplay();
            
            populateProvinces(regionValue);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[1].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            provinceList.style.display = 'block';
        }
    });
    
    provinceList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const provinceName = e.target.textContent;
            
            selection.province = provinceName;
            selection.city = '';
            selection.barangay = '';
            currentSelection.province = provinceName;
            currentSelection.city = '';
            currentSelection.barangay = '';
            
            updateSelectionDisplay();
            
            populateCities(provinceName);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[2].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            cityList.style.display = 'block';
        }
    });
    
    cityList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const cityName = e.target.textContent;
            
            selection.city = cityName;
            selection.barangay = '';
            currentSelection.city = cityName;
            currentSelection.barangay = '';
            
            updateSelectionDisplay();
            
            populateBarangays(cityName);
            
            tabs.forEach(t => t.classList.remove('active'));
            tabs[3].classList.add('active');
            
            locationLists.forEach(list => list.style.display = 'none');
            barangayList.style.display = 'block';
        }
    });
    
    barangayList.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-item')) {
            const barangayName = e.target.textContent;
            
            selection.barangay = barangayName;
            currentSelection.barangay = barangayName;
            
            updateSelectionDisplay();
            
            dropdownContent.classList.remove('active');
            dropdownToggle.querySelector('.arrow').textContent = '▼';
        }
    });
    
    function populateProvinces(regionValue) {
        provinceList.innerHTML = '';
        
        if (locationData.provinces[regionValue]) {
            locationData.provinces[regionValue].forEach(province => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = province;
                provinceList.appendChild(item);
            });
        }
    }
    
    function populateCities(provinceName) {
        cityList.innerHTML = '';
        
        if (locationData.cities[provinceName]) {
            locationData.cities[provinceName].forEach(city => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = city;
                cityList.appendChild(item);
            });
        }
    }
    
    function populateBarangays(cityName) {
        barangayList.innerHTML = '';
        
        if (locationData.barangays[cityName]) {
            locationData.barangays[cityName].forEach(barangay => {
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = barangay;
                barangayList.appendChild(item);
            });
        }
    }
    
    function updateSelectionDisplay() {
        let displayText = '';
        
        if (selection.region) {
            displayText = selection.region;
            
            if (selection.province) {
                displayText += ', ' + selection.province;
                
                if (selection.city) {
                    displayText += ', ' + selection.city;
                    
                    if (selection.barangay) {
                        displayText += ', ' + selection.barangay;
                    }
                }
            }
        } else {
            displayText = 'Region, Province, City, Barangay';
        }
        
        selectedLocation.textContent = displayText;
    }
    
    homeLabel.addEventListener('click', function() {
        homeLabel.classList.add('active');
        workLabel.classList.remove('active');
        addressLabelInput.value = 'home';
    });
    
    workLabel.addEventListener('click', function() {
        workLabel.classList.add('active');
        homeLabel.classList.remove('active');
        addressLabelInput.value = 'work';
    });
    
    streetAddress.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        
        if (input.length < 2) {
            addressSuggestions.style.display = 'none';
            return;
        }
        
        const filteredAddresses = sampleAddresses.filter(addr => 
            addr.toLowerCase().includes(input)
        );
        
        if (filteredAddresses.length > 0) {
            addressSuggestions.innerHTML = '';
            filteredAddresses.forEach(addr => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = addr;
                
                item.addEventListener('click', function() {
                    streetAddress.value = addr;
                    addressSuggestions.style.display = 'none';
                });
                
                addressSuggestions.appendChild(item);
            });
            addressSuggestions.style.display = 'block';
        } else {
            addressSuggestions.style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target !== streetAddress && e.target !== addressSuggestions) {
            addressSuggestions.style.display = 'none';
        }
    });
}

let currentEditId = null;
let currentSelection = {
    region: '',
    province: '',
    city: '',
    barangay: ''
};

function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    fetch('/api/addresses')
        .then(response => response.json())
        .then(data => {
            addressesList.innerHTML = '';
            if (!data.success || !data.addresses || data.addresses.length === 0) {
                addressesList.innerHTML = '<p class="no-addresses">You have no saved addresses. Add a new address to get started.</p>';
                return;
            }
            // Sort addresses: default address first
            data.addresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
            data.addresses.forEach(address => {
                const addressCard = document.createElement('div');
                addressCard.className = `address-card${address.isDefault ? ' default' : ''}`;
                addressCard.innerHTML = `
                    <div class="address-header">
                        <span class="address-name">${address.firstName} ${address.lastName}</span>
                        <span class="address-separator">|</span>
                        <span class="address-phone">${address.phoneNumber}</span>
                        <div class="address-actions">
                            <a href="#" class="edit-btn" data-id="${address.id}">Edit</a>
                            ${!address.isDefault ? `<a href="#" class="delete-btn" data-id="${address.id}">Delete</a>` : ''}
                        </div>
                    </div>
                    <div class="address-details">
                        <div>${address.street_address || ''}</div>
                        <div>${address.complete_address || ''}${address.postalCode ? ', ' + address.postalCode : ''}</div>
                    </div>
                    ${address.isDefault ? '<span class="default-badge">Default</span>' : `<button class="set-default-btn" data-id="${address.id}">Set as default</button>`}
                `;
                addressesList.appendChild(addressCard);
            });
            addAddressButtonListeners();
        })
        .catch(error => {
            addressesList.innerHTML = '<p class="no-addresses">Failed to load addresses.</p>';
        });
}

function addAddressButtonListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            openAddressModal('edit', addressId);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this address?')) {
                deleteAddress(addressId);
            }
        });
    });
    document.querySelectorAll('.set-default-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            setDefaultAddress(addressId);
        });
    });
}

function openAddressModal(mode, addressId = null) {
    const addressModal = document.getElementById('addressModal');
    const modalTitle = document.getElementById('addressModalTitle');
    const defaultAddressCheckbox = document.getElementById('defaultAddress');
    const saveButton = document.getElementById('saveAddressModal');
    
    resetAddressForm();
    
    if (mode === 'edit' && addressId) {
        modalTitle.textContent = 'Edit Address';
        currentEditId = addressId;
        
        // Fetch the address data from the server
        fetch(`/api/address/${addressId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const address = data.address;
                    document.getElementById('firstName').value = address.firstName || '';
                    document.getElementById('lastName').value = address.lastName || '';
                    document.getElementById('phoneNumber').value = address.phoneNumber || '';
                    document.getElementById('postalCode').value = address.postalCode || '';
                    document.getElementById('streetAddress').value = address.streetAddress || '';
                    document.getElementById('completeAddress').value = address.completeAddress || '';
                    
                    // Set the label
                    if (address.label === 'work') {
                        document.getElementById('workLabel').classList.add('active');
                        document.getElementById('homeLabel').classList.remove('active');
                        document.getElementById('addressLabel').value = 'work';
                    } else {
                        document.getElementById('homeLabel').classList.add('active');
                        document.getElementById('workLabel').classList.remove('active');
                        document.getElementById('addressLabel').value = 'home';
                    }
                    
                    // Set default address checkbox
                    defaultAddressCheckbox.checked = address.isDefault;
                } else {
                    console.error('Error loading address:', data.message);
                    const statusMessage = document.getElementById('statusMessage');
                    statusMessage.textContent = 'Error loading address data: ' + data.message;
                    statusMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                const statusMessage = document.getElementById('statusMessage');
                statusMessage.textContent = 'Error loading address data';
                statusMessage.style.display = 'block';
            });
    } else {
        modalTitle.textContent = 'Add New Address';
        currentEditId = null;
        defaultAddressCheckbox.checked = false;
    }
    
    // Always hide the address dropdown panel when opening the modal
    document.getElementById('addressDropdownPanel').style.display = 'none';

    addressModal.classList.add('active');
}

function resetAddressForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('postalCode').value = '';
    document.getElementById('streetAddress').value = '';
    document.getElementById('completeAddress').value = '';
    document.getElementById('homeLabel').classList.add('active');
    document.getElementById('workLabel').classList.remove('active');
    document.getElementById('addressLabel').value = 'home';
    document.getElementById('defaultAddress').checked = false;
}

function saveAddress() {
    console.log('Save button clicked');
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const streetAddress = document.getElementById('streetAddress').value.trim();
    const completeAddress = document.getElementById('completeAddress').value.trim();
    const addressLabel = document.getElementById('addressLabel').value;
    const setAsDefault = document.getElementById('defaultAddress').checked;

    // Phone number validation: PH (09XXXXXXXXX or +639XXXXXXXXX) or international (+XXXXXXXXXXX, 10-15 digits)
    const phonePattern = /^(09\d{9}|\+639\d{9}|\+\d{10,15})$/;
    const phoneNumberError = document.getElementById('phoneNumberError');
    if (!phonePattern.test(phoneNumber)) {
        phoneNumberError.style.display = 'block';
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.style.display = 'none';
        // Scroll to the phone number input
        document.getElementById('phoneNumber').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    } else {
        phoneNumberError.style.display = 'none';
    }

    // Validate required fields
    const requiredFields = {
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'phoneNumber': 'Phone Number',
        'streetAddress': 'Street Address',
        'completeAddress': 'Complete Address',
        'postalCode': 'Postal Code'
    };

    for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.textContent = `${fieldName} is required`;
            statusMessage.style.display = 'block';
            // Scroll to the required field
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }

    const addressData = {
        firstName,
        lastName,
        phoneNumber,
        postalCode,
        streetAddress,
        completeAddress,
        label: addressLabel,
        isDefault: setAsDefault
    };

    console.log('Sending addressData:', addressData);

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `/api/address/${currentEditId}` : '/add-address';
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
        const statusMessage = document.getElementById('statusMessage');
        if (data.success) {
            statusMessage.textContent = 'Address saved to database!';
            statusMessage.style.display = 'block';
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
            document.getElementById('addressModal').classList.remove('active');
            loadAddresses();
            currentEditId = null;
        } else {
            statusMessage.textContent = 'Error: ' + data.message;
            statusMessage.style.display = 'block';
            // Scroll to the error message
            statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = 'Error: ' + error;
        statusMessage.style.display = 'block';
        // Scroll to the error message
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function deleteAddress(addressId) {
    fetch(`/api/address/${addressId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statusMessage = document.getElementById('statusMessage');
        if (data.success) {
            statusMessage.textContent = 'Address deleted successfully!';
            statusMessage.style.display = 'block';
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 3000);
            loadAddresses();
        } else {
            statusMessage.textContent = 'Error: ' + data.message;
            statusMessage.style.display = 'block';
        }
    })
    .catch(error => {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = 'Error: ' + error;
        statusMessage.style.display = 'block';
    });
}

function setDefaultAddress(addressId) {
    fetch(`/api/address/${addressId}/set-default`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAddresses();
        } else {
            alert('Failed to set default address: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error setting default address: ' + error);
    });
}

function updateUIForLoginStatus(isLoggedIn, username) {
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (isLoggedIn && username) {
        usernameDisplay.textContent = current_user.username;
    } else {
        usernameDisplay.textContent = '';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

var footerShopLink = document.getElementById('footerShopLink');
if (footerShopLink) {
    footerShopLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'shop.html';
    });
}

const homeLabel = document.getElementById('homeLabel');
const workLabel = document.getElementById('workLabel');
const addressLabelInput = document.getElementById('addressLabel');

homeLabel.addEventListener('click', function () {
    homeLabel.classList.add('active');
    workLabel.classList.remove('active');
    addressLabelInput.value = 'home';
});

workLabel.addEventListener('click', function () {
    workLabel.classList.add('active');
    homeLabel.classList.remove('active');
    addressLabelInput.value = 'work';
});

// Address Dropdown Panel Logic
function showAddressDropdown() {
    document.getElementById('addressDropdownPanel').style.display = 'block';
}

document.addEventListener('click', function(event) {
    const panel = document.getElementById('addressDropdownPanel');
    const input = document.getElementById('completeAddress');
    if (!panel.contains(event.target) && event.target !== input) {
        panel.style.display = 'none';
    }
});

// PSGC API endpoints
const PSGC_API = {
    region: 'https://psgc.rootscratch.com/region',
    province: 'https://psgc.rootscratch.com/province?id=',
    city: 'https://psgc.rootscratch.com/municipal-city?id=',
    barangay: 'https://psgc.rootscratch.com/barangay?id='
};

let selectedRegion = '';
let selectedRegionId = '';
let selectedProvince = '';
let selectedProvinceId = '';
let selectedCity = '';
let selectedCityId = '';
let selectedBarangay = '';

function renderRegionTab() {
    const regionTab = document.getElementById('regionTabContent');
    regionTab.innerHTML = '<div>Loading...</div>';
    fetch(PSGC_API.region)
        .then(res => res.json())
        .then(regions => {
            regionTab.innerHTML = '';
            regions.forEach(region => {
                const div = document.createElement('div');
                div.className = 'location-item';
                div.textContent = region.name;
                div.onclick = function() {
                    selectedRegion = region.name;
                    selectedRegionId = region.psgc_id;
                    selectedProvince = '';
                    selectedProvinceId = '';
                    selectedCity = '';
                    selectedCityId = '';
                    selectedBarangay = '';
                    renderProvinceTab();
                    switchTab('province');
                    updateCompleteAddress();
                };
                regionTab.appendChild(div);
            });
        });
}

function renderProvinceTab() {
    const provinceTab = document.getElementById('provinceTabContent');
    provinceTab.innerHTML = '<div>Loading...</div>';
    if (!selectedRegionId) return;
    fetch(PSGC_API.province + selectedRegionId)
        .then(res => res.json())
        .then(provinces => {
            provinceTab.innerHTML = '';
            provinces.forEach(province => {
                const div = document.createElement('div');
                div.className = 'location-item';
                div.textContent = province.name;
                div.onclick = function() {
                    selectedProvince = province.name;
                    selectedProvinceId = province.psgc_id;
                    selectedCity = '';
                    selectedCityId = '';
                    selectedBarangay = '';
                    renderCityTab();
                    switchTab('city');
                    updateCompleteAddress();
                };
                provinceTab.appendChild(div);
            });
        });
}

function renderCityTab() {
    const cityTab = document.getElementById('cityTabContent');
    cityTab.innerHTML = '<div>Loading...</div>';
    if (!selectedProvinceId) return;
    fetch(PSGC_API.city + selectedProvinceId)
        .then(res => res.json())
        .then(cities => {
            cityTab.innerHTML = '';
            cities.forEach(city => {
                const div = document.createElement('div');
                div.className = 'location-item';
                div.textContent = city.name;
                div.onclick = function() {
                    selectedCity = city.name;
                    selectedCityId = city.psgc_id;
                    selectedBarangay = '';
                    renderBarangayTab();
                    switchTab('barangay');
                    updateCompleteAddress();
                };
                cityTab.appendChild(div);
            });
        });
}

function renderBarangayTab() {
    const barangayTab = document.getElementById('barangayTabContent');
    barangayTab.innerHTML = '<div>Loading...</div>';
    if (!selectedCityId) return;
    fetch(PSGC_API.barangay + selectedCityId)
        .then(res => res.json())
        .then(barangays => {
            barangayTab.innerHTML = '';
            barangays.forEach(barangay => {
                const div = document.createElement('div');
                div.className = 'location-item';
                div.textContent = barangay.name;
                div.onclick = function() {
                    selectedBarangay = barangay.name;
                    updateCompleteAddress();
                    document.getElementById('addressDropdownPanel').style.display = 'none';
                };
                barangayTab.appendChild(div);
            });
        });
}

function switchTab(tab) {
    document.querySelectorAll('.address-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.address-tab[data-tab="' + tab + '"]').classList.add('active');
    document.querySelectorAll('.address-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(tab + 'TabContent').style.display = 'block';
}

function updateCompleteAddress() {
    const address = [selectedRegion, selectedProvince, selectedCity, selectedBarangay].filter(Boolean).join(', ');
    document.getElementById('completeAddress').value = address;
    document.getElementById('fullAddress').value = address;
}

// Add this after initializing the dropdown panel
function setupAddressTabClicks() {
    document.querySelectorAll('.address-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName === 'region') {
                switchTab('region');
            } else if (tabName === 'province' && selectedRegion) {
                switchTab('province');
            } else if (tabName === 'city' && selectedRegion && selectedProvince) {
                switchTab('city');
            } else if (tabName === 'barangay' && selectedRegion && selectedProvince && selectedCity) {
                switchTab('barangay');
            }
        });
    });
}

// Call this after rendering the region tab and switching to region
renderRegionTab();
switchTab('region');
setupAddressTabClicks();
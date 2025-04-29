// --- Admin/LocalStorage College Data Management ---
const LOCAL_STORAGE_KEY = 'cs_colleges';

function getColleges() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) return JSON.parse(data);
    // Default colleges (with fees for demo)
    return [
        {
            id: 1,
            name: "Tech University",
            location: "New York",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80", // Tech campus
            description: "A leading institution in technology and innovation",
            courses: [
                { name: "Computer Science", fee: 120000 },
                { name: "Engineering", fee: 110000 },
                { name: "Data Science", fee: 130000 }
            ]
        },
        {
            id: 2,
            name: "Business School",
            location: "London",
            image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80", // Business/meeting
            description: "World-class business education",
            courses: [
                { name: "Business Administration", fee: 100000 },
                { name: "Finance", fee: 105000 },
                { name: "Marketing", fee: 95000 }
            ]
        },
        {
            id: 3,
            name: "Arts College",
            location: "Paris",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // Arts/creative
            description: "Creative excellence in arts and design",
            courses: [
                { name: "Fine Arts", fee: 90000 },
                { name: "Graphic Design", fee: 95000 },
                { name: "Performing Arts", fee: 85000 }
            ]
        }
    ];
}

function saveColleges(colleges) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(colleges));
}

let colleges = getColleges();

// --- College Card Rendering ---
function populateLocationFilter() {
    const filter = document.getElementById('collegeLocationFilter');
    if (!filter) return;
    // Get unique locations
    const locations = Array.from(new Set(colleges.map(c => c.location).filter(Boolean)));
    filter.innerHTML = '<option value="all">All Locations</option>' +
        locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
}

function createCollegeCards(filteredColleges) {
    const collegeContainer = document.getElementById('college-cards');
    collegeContainer.innerHTML = '';
    (filteredColleges || colleges).forEach(college => {
        const card = document.createElement('div');
        card.className = 'col-md-4 animate-fade-in';
        card.innerHTML = `
            <div class="card college-card">
                <img src="${college.image}" class="card-img-top" alt="${college.name}">
                <div class="card-body">
                    <h3>${college.name}</h3>
                    <p class="text-muted"><i class="fas fa-map-marker-alt"></i> ${college.location || ''}</p>
                    <p>${college.description || ''}</p>
                    <div class="courses">
                        <h6>Available Courses & Fees:</h6>
                        <ul class="list-unstyled">
                            ${college.courses.map(course => `<li><i class='fas fa-graduation-cap'></i> ${course.name} <span class='badge bg-info text-dark ms-2'>₹${course.fee}</span></li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="showApplicationForm(${college.id})">Apply Now</button>
                    <button class="btn btn-outline-warning mt-3 ms-2 edit-college-btn d-none" data-id="${college.id}">Edit</button>
                </div>
            </div>
        `;
        collegeContainer.appendChild(card);
    });
    attachEditButtons();
}

// --- Admin Modal Logic ---
function resetAdminForm() {
    document.getElementById('adminModalTitle').textContent = 'Add New College';
    document.getElementById('adminCollegeForm').reset();
    document.getElementById('editCollegeId').value = '';
    document.getElementById('collegeLocation').value = '';
    const coursesContainer = document.getElementById('coursesContainer');
    coursesContainer.innerHTML = `<label class="form-label">Courses & Fees</label>
        <div class="row g-2 mb-2 course-row">
            <div class="col-md-6">
                <input type="text" class="form-control course-name" placeholder="Course Name" required>
            </div>
            <div class="col-md-4">
                <input type="number" class="form-control course-fee" placeholder="Fee (INR)" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remove-course">Remove</button>
            </div>
        </div>`;
}

function attachEditButtons() {
    document.querySelectorAll('.edit-college-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(this.getAttribute('data-id'));
            openEditCollegeModal(id);
        };
    });
}

function openEditCollegeModal(id) {
    const college = colleges.find(c => c.id === id);
    document.getElementById('adminModalTitle').textContent = 'Edit College';
    document.getElementById('editCollegeId').value = college.id;
    document.getElementById('collegeName').value = college.name;
    document.getElementById('collegeLocation').value = college.location || '';
    document.getElementById('collegePhoto').value = college.image;
    // Courses
    const coursesContainer = document.getElementById('coursesContainer');
    coursesContainer.innerHTML = '<label class="form-label">Courses & Fees</label>';
    college.courses.forEach((course, idx) => {
        coursesContainer.innerHTML += `
            <div class="row g-2 mb-2 course-row">
                <div class="col-md-6">
                    <input type="text" class="form-control course-name" placeholder="Course Name" value="${course.name}" required>
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control course-fee" placeholder="Fee (INR)" value="${course.fee}" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger remove-course">Remove</button>
                </div>
            </div>`;
    });
    new bootstrap.Modal(document.getElementById('adminModal')).show();
}

// --- Admin Modal Events ---
document.addEventListener('DOMContentLoaded', () => {
    populateLocationFilter();
    createCollegeCards();
    const locationFilter = document.getElementById('collegeLocationFilter');
    if (locationFilter) {
        locationFilter.onchange = function() {
            const val = this.value;
            if (val === 'all') {
                createCollegeCards();
            } else {
                createCollegeCards(colleges.filter(c => c.location === val));
            }
        };
    }

    // Admin Panel Button
    document.getElementById('adminPanelBtn').onclick = () => {
        resetAdminForm();
        new bootstrap.Modal(document.getElementById('adminModal')).show();
    };

    // Add Course Button
    document.getElementById('addCourseBtn').onclick = () => {
        const coursesContainer = document.getElementById('coursesContainer');
        coursesContainer.innerHTML += `
            <div class="row g-2 mb-2 course-row">
                <div class="col-md-6">
                    <input type="text" class="form-control course-name" placeholder="Course Name" required>
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control course-fee" placeholder="Fee (INR)" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger remove-course">Remove</button>
                </div>
            </div>`;
        attachRemoveCourseBtns();
    };

    // Remove Course Button
    function attachRemoveCourseBtns() {
        document.querySelectorAll('.remove-course').forEach(btn => {
            btn.onclick = function() {
                const row = this.closest('.course-row');
                if (document.querySelectorAll('.course-row').length > 1) row.remove();
            };
        });
    }
    attachRemoveCourseBtns();

    // Admin Form Submit
    document.getElementById('adminCollegeForm').onsubmit = function(e) {
        e.preventDefault();
        const id = document.getElementById('editCollegeId').value;
        const name = document.getElementById('collegeName').value;
        const location = document.getElementById('collegeLocation').value;
        const image = document.getElementById('collegePhoto').value;
        const courseRows = document.querySelectorAll('.course-row');
        const courses = [];
        courseRows.forEach(row => {
            const cname = row.querySelector('.course-name').value;
            const cfee = row.querySelector('.course-fee').value;
            if (cname && cfee) courses.push({ name: cname, fee: Number(cfee) });
        });
        if (!courses.length) return alert('Add at least one course');
        if (id) {
            // Edit
            const idx = colleges.findIndex(c => c.id == id);
            colleges[idx].name = name;
            colleges[idx].location = location;
            colleges[idx].image = image;
            colleges[idx].courses = courses;
        } else {
            // Add
            const newId = Date.now();
            colleges.push({ id: newId, name, location, image, courses });
        }
        saveColleges(colleges);
        populateLocationFilter();
        createCollegeCards();
        bootstrap.Modal.getInstance(document.getElementById('adminModal')).hide();
    };

    // Attach remove course buttons on modal open
    document.getElementById('adminModal').addEventListener('shown.bs.modal', attachRemoveCourseBtns);

    // --- Existing search functionality ---
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredColleges = colleges.filter(college =>
            college.name.toLowerCase().includes(searchTerm) ||
            (college.location && college.location.toLowerCase().includes(searchTerm)) ||
            college.courses.some(course => course.name.toLowerCase().includes(searchTerm))
        );
        const collegeContainer = document.getElementById('college-cards');
        collegeContainer.innerHTML = '';
        filteredColleges.forEach(college => {
            const card = document.createElement('div');
            card.className = 'col-md-4 animate-fade-in';
            card.innerHTML = `
                <div class="card college-card">
                    <img src="${college.image}" class="card-img-top" alt="${college.name}">
                    <div class="card-body">
                        <h3>${college.name}</h3>
                        <p class="text-muted"><i class="fas fa-map-marker-alt"></i> ${college.location || ''}</p>
                        <div class="courses">
                            <h6>Available Courses & Fees:</h6>
                            <ul class="list-unstyled">
                                ${college.courses.map(course => `<li><i class='fas fa-graduation-cap'></i> ${course.name} <span class='badge bg-info text-dark ms-2'>₹${course.fee}</span></li>`).join('')}
                            </ul>
                        </div>
                        <button class="btn btn-primary mt-3" onclick="showApplicationForm(${college.id})">Apply Now</button>
                        <button class="btn btn-outline-warning mt-3 ms-2 edit-college-btn" data-id="${college.id}">Edit</button>
                    </div>
                </div>
            `;
            collegeContainer.appendChild(card);
        });
        attachEditButtons();
    });

    // Duplicate moving images for seamless loop
    const track = document.getElementById('movingImagesTrack');
    if (track) {
        track.innerHTML += track.innerHTML;
    }

    // Top image carousel logic
    const carousel = document.getElementById('topImageCarousel');
    if (carousel) {
        const images = carousel.querySelectorAll('.carousel-img');
        let current = 0;
        setInterval(() => {
            images[current].classList.remove('active');
            current = (current + 1) % images.length;
            images[current].classList.add('active');
        }, 40000); // 40 seconds
    }
 
    updateAdminUI();
    document.getElementById('adminLoginBtn').onclick = function() {
        if (isAdminLoggedIn()) {
            setAdminLoggedIn(false);
            updateAdminUI();
        } else {
            const pwd = prompt('Enter admin password:');
            if (pwd === 'admin123') {
                setAdminLoggedIn(true);
                updateAdminUI();
            } else if (pwd !== null) {
                alert('Incorrect password!');
            }
        }
    };
});

// --- Application Form Logic (unchanged, but update for new course structure) ---
function showApplicationForm(collegeId) {
    const college = colleges.find(c => c.id === collegeId);
    const formHtml = `
        <div class="modal fade" id="applicationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Application Form - ${college.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="applicationForm">
                            <div class="mb-3">
                                <label for="fullName" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="fullName" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="phone" required>
                            </div>
                            <div class="mb-3">
                                <label for="course" class="form-label">Select Course</label>
                                <select class="form-select" id="course" required>
                                    ${college.courses.map(course => `<option value="${course.name}">${course.name} (₹${course.fee})</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Additional Information</label>
                                <textarea class="form-control" id="message" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submitApplication()">Submit Application</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    const existingModal = document.getElementById('applicationModal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', formHtml);
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();
}

// Function to submit application
function submitApplication() {
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Here you would typically send the data to a server
    console.log('Application submitted:', data);

    // Show success message
    alert('Application submitted successfully! We will contact you soon.');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
    modal.hide();
}

// --- Courses & Services Section Management ---
const COURSES_SECTION_KEY = 'cs_courses_section';

function getCoursesSection() {
    const data = localStorage.getItem(COURSES_SECTION_KEY);
    if (data) return JSON.parse(data);
    // Default values
    return {
        left: [
            'Polytechnic, Diploma',
            'B.Tech, M.Tech, BJMC',
            'GNM/ANM, B.Nursing, MBBS & All'
        ],
        right: [
            'Hotel/Hospital Management',
            'B.Sc.(Agri), MBA/MCA'
        ]
    };
}

function saveCoursesSection(section) {
    localStorage.setItem(COURSES_SECTION_KEY, JSON.stringify(section));
}

function renderCoursesSection() {
    const section = getCoursesSection();
    const left = document.getElementById('coursesListLeft');
    const right = document.getElementById('coursesListRight');
    if (left && right) {
        left.innerHTML = section.left.map(item => `<li>${item}</li>`).join('');
        right.innerHTML = section.right.map(item => `<li>${item}</li>`).join('');
    }
}

// --- Edit Courses Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    renderCoursesSection();
    const editBtn = document.getElementById('editCoursesBtn');
    const editModal = new bootstrap.Modal(document.getElementById('editCoursesModal'));
    const section = getCoursesSection();

    function attachEditCoursesListeners() {
        // Left column
        document.querySelectorAll('.course-edit-left').forEach((input, idx) => {
            input.oninput = function() {
                section.left[idx] = this.value;
            };
        });
        document.querySelectorAll('.remove-course-left').forEach((btn, idx) => {
            btn.onclick = function() {
                section.left.splice(idx, 1);
                renderEditCourses();
            };
        });
        // Right column
        document.querySelectorAll('.course-edit-right').forEach((input, idx) => {
            input.oninput = function() {
                section.right[idx] = this.value;
            };
        });
        document.querySelectorAll('.remove-course-right').forEach((btn, idx) => {
            btn.onclick = function() {
                section.right.splice(idx, 1);
                renderEditCourses();
            };
        });
    }

    function renderEditCourses() {
        const leftDiv = document.getElementById('editCoursesLeft');
        const rightDiv = document.getElementById('editCoursesRight');
        leftDiv.innerHTML = '';
        rightDiv.innerHTML = '';
        section.left.forEach((item, idx) => {
            leftDiv.innerHTML += `<div class='input-group mb-2'><input type='text' class='form-control course-edit-left' value="${item}"><button type='button' class='btn btn-danger btn-sm remove-course-left' data-idx='${idx}'>Remove</button></div>`;
        });
        section.right.forEach((item, idx) => {
            rightDiv.innerHTML += `<div class='input-group mb-2'><input type='text' class='form-control course-edit-right' value="${item}"><button type='button' class='btn btn-danger btn-sm remove-course-right' data-idx='${idx}'>Remove</button></div>`;
        });
        attachEditCoursesListeners();
    }

    editBtn.onclick = function() {
        // Always reload from storage in case of changes
        const fresh = getCoursesSection();
        section.left = [...fresh.left];
        section.right = [...fresh.right];
        renderEditCourses();
        editModal.show();
    };

    document.getElementById('addCourseLeft').onclick = function() {
        section.left.push('');
        renderEditCourses();
    };
    document.getElementById('addCourseRight').onclick = function() {
        section.right.push('');
        renderEditCourses();
    };

    document.getElementById('editCoursesForm').onsubmit = function(e) {
        e.preventDefault();
        // Remove empty items
        section.left = section.left.map(x => x.trim()).filter(x => x);
        section.right = section.right.map(x => x.trim()).filter(x => x);
        saveCoursesSection(section);
        renderCoursesSection();
        editModal.hide();
    };
});

// --- Banner Carousel Management ---
const BANNER_IMAGES_KEY = 'cs_banner_images';
function getBannerImages() {
    const data = localStorage.getItem(BANNER_IMAGES_KEY);
    if (data) return JSON.parse(data);
    return [
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80'
    ];
}
function saveBannerImages(images) {
    localStorage.setItem(BANNER_IMAGES_KEY, JSON.stringify(images));
}
let bannerInterval = null;
function renderBannerCarousel() {
    const carousel = document.getElementById('bannerCarousel');
    if (!carousel) return;
    const images = getBannerImages();
    carousel.innerHTML = images.map((src, i) => `<img src="${src}" class="banner-img${i===0?' active':''}" alt="Banner ${i+1}">`).join('') +
        '<button class="btn btn-outline-warning position-absolute top-0 end-0 m-3 d-none" id="editBannerBtn">Edit Banner Images</button>';
    updateAdminUI();
    startBannerCarousel();
}

function startBannerCarousel() {
    const carousel = document.getElementById('bannerCarousel');
    if (!carousel) return;
    const imgs = carousel.querySelectorAll('.banner-img');
    let current = 0;
    // Find the currently active image
    imgs.forEach((img, idx) => { if (img.classList.contains('active')) current = idx; });
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
    }, 40000);
}

// --- Banner Carousel Logic ---
document.addEventListener('DOMContentLoaded', () => {
    renderBannerCarousel();
    // Admin Edit Banner Modal
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'editBannerBtn') {
            const images = getBannerImages();
            const list = document.getElementById('bannerImagesList');
            list.innerHTML = images.map((src, i) => `
                <div class='input-group mb-2'>
                    <input type='url' class='form-control banner-image-url' value="${src}">
                    <button type='button' class='btn btn-danger btn-sm remove-banner-image' data-idx='${i}'>Delete</button>
                </div>
            `).join('');
            new bootstrap.Modal(document.getElementById('editBannerModal')).show();
        }
    });
    document.getElementById('addBannerImageBtn').onclick = function() {
        const url = document.getElementById('newBannerImageUrl').value.trim();
        if (url) {
            const images = getBannerImages();
            images.push(url);
            saveBannerImages(images);
            document.getElementById('newBannerImageUrl').value = '';
            // Refresh modal list
            document.getElementById('editBannerBtn').click();
        }
    };
    document.getElementById('bannerImagesList').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-banner-image')) {
            const idx = Number(e.target.getAttribute('data-idx'));
            const images = getBannerImages();
            images.splice(idx, 1);
            saveBannerImages(images);
            // Refresh modal list
            document.getElementById('editBannerBtn').click();
        }
    });
    document.getElementById('bannerImagesList').addEventListener('input', function(e) {
        if (e.target.classList.contains('banner-image-url')) {
            const inputs = Array.from(document.querySelectorAll('.banner-image-url'));
            const images = inputs.map(input => input.value.trim()).filter(Boolean);
            saveBannerImages(images);
        }
    });
    document.getElementById('editBannerForm').onsubmit = function(e) {
        e.preventDefault();
        // Save all URLs
        const inputs = Array.from(document.querySelectorAll('.banner-image-url'));
        const images = inputs.map(input => input.value.trim()).filter(Boolean);
        saveBannerImages(images);
        renderBannerCarousel();
        startBannerCarousel();
        bootstrap.Modal.getInstance(document.getElementById('editBannerModal')).hide();
    };

    // Re-render and restart carousel on modal close
    document.getElementById('editBannerModal').addEventListener('hidden.bs.modal', function() {
        renderBannerCarousel();
        startBannerCarousel();
    });
});

// --- Admin Login State Management ---
const ADMIN_LOGIN_KEY = 'cs_admin_logged_in';
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_LOGIN_KEY) === 'true';
}
function setAdminLoggedIn(val) {
    localStorage.setItem(ADMIN_LOGIN_KEY, val ? 'true' : 'false');
}
function updateAdminUI() {
    const show = isAdminLoggedIn();
    const ids = ['adminPanelBtn', 'editBannerBtn', 'editCoursesBtn'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('d-none', !show);
    });
    document.querySelectorAll('.edit-college-btn').forEach(btn => btn.classList.toggle('d-none', !show));
    const loginBtn = document.getElementById('adminLoginBtn');
    if (show) {
        loginBtn.textContent = 'Logout';
        loginBtn.classList.remove('btn-outline-primary');
        loginBtn.classList.add('btn-danger');
    } else {
        loginBtn.textContent = 'Admin Login';
        loginBtn.classList.add('btn-outline-primary');
        loginBtn.classList.remove('btn-danger');
    }
}

// Admin Login Modal
const adminLoginModal = new bootstrap.Modal(document.getElementById('adminLoginModal'));

// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Show admin login modal when login button is clicked
document.getElementById('adminLoginBtn').addEventListener('click', () => {
    adminLoginModal.show();
});

// Handle admin login form submission
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        document.getElementById('adminPanelBtn').classList.remove('d-none');
        document.getElementById('adminLoginBtn').classList.add('d-none');
        adminLoginModal.hide();
        
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        successAlert.innerHTML = `
            <strong>Success!</strong> You are now logged in as admin.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(successAlert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            successAlert.remove();
        }, 3000);
    } else {
        // Failed login
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show';
        errorAlert.innerHTML = `
            <strong>Error!</strong> Invalid username or password.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.getElementById('adminLoginForm').prepend(errorAlert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            errorAlert.remove();
        }, 3000);
    }
});

// Show admin panel when admin panel button is clicked
document.getElementById('adminPanelBtn').addEventListener('click', () => {
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    adminModal.show();
}); 
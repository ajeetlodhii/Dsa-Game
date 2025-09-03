// Global variables and state management
const content = document.getElementById('content');
const navAuthBtn = document.getElementById('nav-auth-btn');
const navProfileContainer = document.getElementById('nav-profile-container');
const navUsername = document.getElementById('nav-username');
const navAvatar = document.getElementById('nav-avatar');
const mobileNavAuthBtn = document.getElementById('mobile-nav-auth-btn');
const mobileNavProfileContainer = document.getElementById('mobile-nav-profile-container');
const mobileNavUsername = document.getElementById('mobile-nav-username');
const mobileNavAvatar = document.getElementById('mobile-nav-avatar');
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const notification = document.getElementById('notification');

let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let scores = JSON.parse(localStorage.getItem('scores')) || [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || {};
let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
let gameRatings = JSON.parse(localStorage.getItem('gameRatings')) || {};
let settings = JSON.parse(localStorage.getItem('settings')) || { theme: 'dark', difficulty: 'medium', sound: true };

// Add admin user if it doesn't exist
if (!users.some(u => u.username === 'admin')) {
    users.push({
        username: 'admin',
        email: 'admin@dsagamehub.com',
        password: 'admin123',
        avatar: 'https://placehold.co/100x100/4f46e5/FFFFFF?text=ADM',
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        wins: 0,
        isAdmin: true
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Utility Functions
function saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('feedback', JSON.stringify(feedback));
    localStorage.setItem('gameRatings', JSON.stringify(gameRatings));
    localStorage.setItem('settings', JSON.stringify(settings));
}

function navigate(path) {
    window.location.hash = path;
}

function hideModal() {
    const modal = document.getElementById('custom-modal');
    modal.classList.add('hidden');
}

function showModal(title, message, isConfirm = false, callback = null) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').innerHTML = message;
    const okBtn = document.getElementById('modal-ok-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // Reset event listeners to avoid duplicates
    okBtn.onclick = null;
    cancelBtn.onclick = null;

    modal.classList.remove('hidden');

    return new Promise((resolve) => {
        okBtn.onclick = () => {
            modal.classList.add('hidden');
            if (callback) callback();
            resolve(true);
        };
        
        if (isConfirm) {
            cancelBtn.classList.remove('hidden');
            cancelBtn.onclick = () => {
                modal.classList.add('hidden');
                resolve(false);
            };
        } else {
            cancelBtn.classList.add('hidden');
        }
    });
}

function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function updateAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    currentUser = user;
    
    if (currentUser) {
        // Update navigation
        navAuthBtn.classList.add('hidden');
        navProfileContainer.classList.remove('hidden');
        navUsername.textContent = currentUser.username;
        navAvatar.src = currentUser.avatar;
        
        // Make profile links clickable
        document.getElementById('nav-profile-container').addEventListener('click', () => { navigate('profile'); });
        
        mobileNavAuthBtn.classList.add('hidden');
        mobileNavProfileContainer.classList.remove('hidden');
        mobileNavUsername.textContent = currentUser.username;
        mobileNavAvatar.src = currentUser.avatar;

        document.getElementById('mobile-nav-profile-container').addEventListener('click', () => { navigate('profile'); });
        
        // Show admin menu if user is admin
        const existingAdminLink = document.getElementById('nav-admin-link');
        const existingMobileAdminLink = document.getElementById('mobile-nav-admin-link');

        if (currentUser.isAdmin) {
            if (!existingAdminLink) {
                const adminLink = document.createElement('a');
                adminLink.href = '#admin';
                adminLink.id = 'nav-admin-link';
                adminLink.className = 'text-gray-300 hover:text-white transition-colors duration-200';
                adminLink.textContent = 'Admin';
                document.querySelector('.hidden.md\\:flex.space-x-6').appendChild(adminLink);
            }
            if (!existingMobileAdminLink) {
                const mobileAdminLink = document.createElement('a');
                mobileAdminLink.href = '#admin';
                mobileAdminLink.id = 'mobile-nav-admin-link';
                mobileAdminLink.className = 'text-gray-300 hover:text-white w-full text-center py-2';
                document.querySelector('#mobile-menu .flex.flex-col').insertBefore(mobileAdminLink, document.querySelector('#mobile-menu .px-4'));
            }
        } else {
            if (existingAdminLink) existingAdminLink.remove();
            if (existingMobileAdminLink) existingMobileAdminLink.remove();
        }
    } else {
        navAuthBtn.classList.remove('hidden');
        navProfileContainer.classList.add('hidden');
        
        mobileNavAuthBtn.classList.remove('hidden');
        mobileNavProfileContainer.classList.add('hidden');
        
        // Hide admin link if user is logged out
        const existingAdminLink = document.getElementById('nav-admin-link');
        const existingMobileAdminLink = document.getElementById('mobile-nav-admin-link');
        if (existingAdminLink) existingAdminLink.remove();
        if (existingMobileAdminLink) existingMobileAdminLink.remove();
    }
}

function checkAuthentication(callback) {
    updateAuthState();
    if (currentUser) {
        callback();
    } else {
        navigate('login');
        showModal('Unauthorized', 'Please login to access this page.');
    }
}

// --- Page Render Functions ---
// 1. Home Page
function renderHomePage() {
    fetch('home.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            document.querySelectorAll('a[href="#topics"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigate('topics');
                });
            });
            document.querySelectorAll('a[href="#login"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigate('login');
                });
            });
             document.querySelectorAll('a[href="#signup"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigate('signup');
                });
            });
             document.querySelectorAll('a[href^="#game"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigate(e.target.getAttribute('href').substring(1));
                });
            });
            
            const quickLeaderboardList = document.querySelector('#quick-leaderboard-list');
            if (quickLeaderboardList) {
                const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5);
                quickLeaderboardList.innerHTML = renderLeaderboardList(sortedScores, false);
            }
        });
}

function renderGameCard(title, description, gameType) {
    return `
        <div class="card p-6 flex flex-col items-center text-center animate-pop">
            <div class="w-16 h-16 mb-4 rounded-full bg-primary-color flex items-center justify-center text-white text-3xl">
                ${getGameIcon(gameType)}
            </div>
            <h3 class="text-xl font-bold">${title}</h3>
            <p class="mt-2 text-gray-400">${description}</p>
            <a href="#game?name=${gameType}" class="mt-4 btn-primary animated-button">Play Now</a>
        </div>
    `;
}

function getGameIcon(gameType) {
    const icons = {
        'graph': '📊',
        'sorting': '🔢',
        'stack': '🏗️',
        'queue': '🔄',
        'tree': '🌳',
        'hash': '🔑',
        'array': '📋',
        'string': '🔤',
        'maze-explorer': '🗺️',
        'binary-tree': '🌲'
    };
    return icons[gameType] || '🎲';
}

// 2. Login Page
function renderLoginPage() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            document.getElementById('forgot-password').addEventListener('click', (e) => {
                e.preventDefault();
                showModal('Forgot Password', 'For this demo, you can use:<br><br>Username: **demo**<br>Password: **demo123**<br><br>Or create a new account.');
            });

            // Handle "Remember Me"
            const storedUsername = localStorage.getItem('rememberedUser');
            if (storedUsername) {
                document.getElementById('login-username').value = storedUsername;
                document.getElementById('remember-me').checked = true;
            }
        });
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Check for demo account
    if (username === 'demo' && password === 'demo123') {
        const demoUser = users.find(u => u.username === 'demo') || {
            username: 'demo',
            email: 'demo@dsagamehub.com',
            password: 'demo123',
            avatar: 'https://placehold.co/100x100/8b5cf6/FFFFFF?text=D',
            createdAt: new Date().toISOString(),
            gamesPlayed: 0,
            wins: 0
        };
        
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        showNotification('Demo account logged in!');
        navigate('profile');
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        showNotification(`Welcome back, ${user.username}!`);
        navigate('profile');
    } else {
        showModal('Login Failed', 'Invalid username or password.');
    }
}

// 3. Signup Page
function renderSignupPage() {
    fetch('signup.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            document.getElementById('signup-form').addEventListener('submit', handleSignup);
            document.querySelectorAll('.avatar-option').forEach(img => {
                img.addEventListener('click', () => {
                    document.querySelectorAll('.avatar-option').forEach(i => i.classList.remove('ring-4', 'ring-primary-color'));
                    img.classList.add('ring-4', 'ring-primary-color');
                    document.getElementById('selected-avatar').value = img.dataset.src;
                });
            });
        });
}

function renderAvatarIcons() {
    const avatars = [
        "https://placehold.co/100x100/9a545a/FFFFFF?text=A",
        "https://placehold.co/100x100/3e6f9e/FFFFFF?text=B",
        "https://placehold.co/100x100/8c728e/FFFFFF?text=C",
        "https://placehold.co/100x100/d79922/FFFFFF?text=D",
        "https://placehold.co/100x100/5c8c5c/FFFFFF?text=E",
        "https://placehold.co/100x100/c77dff/FFFFFF?text=F",
        "https://placehold.co/100x100/ff6b6b/FFFFFF?text=G",
        "https://placehold.co/100x100/4ecdc4/FFFFFF?text=H"
    ];
    return avatars.map(src => `
        <img src="${src}" data-src="${src}" class="avatar-option w-full h-auto rounded-full cursor-pointer transition-transform hover:scale-110" alt="Avatar">
    `).join('');
}

function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const avatar = document.getElementById('selected-avatar').value;

    // Basic validation
    if (!username) {
        return showModal('Registration Failed', 'Username cannot be empty.');
    }
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return showModal('Registration Failed', 'Username already exists.');
    }
    
    if (!email || !email.includes('@')) {
        return showModal('Registration Failed', 'Please enter a valid email address.');
    }
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return showModal('Registration Failed', 'Email already exists.');
    }
    
    if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return showModal('Registration Failed', 'Password must be at least 8 characters and include a number and a special character.');
    }
    
    if (!avatar) {
        return showModal('Registration Failed', 'Please select an avatar.');
    }

    const newUser = {
        username,
        email,
        password,
        avatar,
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        wins: 0,
        isAdmin: false
    };
    users.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    saveToLocalStorage();
    showNotification('Account created successfully!');
    navigate('profile');
}

// 4. Game Shell
function renderGamePage() {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const gameName = params.get('name') || 'sorting';
    const gameTitle = gameName.charAt(0).toUpperCase() + gameName.slice(1).replace(/-/g, ' ');
    
    fetch('game.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            document.getElementById('game-title').textContent = gameTitle;
            // Wait for DOM to be fully loaded
            setTimeout(() => {
                initializeGame(gameName);
            }, 500);
        });
}

function initializeGame(gameName) {
    const gameArea = document.getElementById('game-area');
    const gameControls = document.getElementById('game-controls');
    const gameScoreEl = document.getElementById('game-score');
    const gameTimerEl = document.getElementById('game-timer');
    const gameLevelEl = document.getElementById('game-level');
    const gameAttemptsEl = document.getElementById('game-attempts');
    const pauseBtn = document.getElementById('pause-btn');
    const instructionsBtn = document.getElementById('instructions-btn');
    const restartBtn = document.getElementById('restart-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const hintBtn = document.getElementById('hint-btn');

    let score = 0;
    let time = 0;
    let level = 1;
    let attempts = 3;
    let isPaused = false;
    let usedHint = false;
    let gameInterval = null;
    let gameData = null;

    function updateHUD() {
        gameScoreEl.textContent = `Score: ${score}`;
        gameTimerEl.textContent = `Time: ${time}s`;
        gameLevelEl.textContent = `Level: ${level}`;
        gameAttemptsEl.textContent = `Attempts: ${attempts}`;
    }

    function startTimer() {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            if (!isPaused) {
                time++;
                updateHUD();
                
                // End game if time limit reached
                if (time >= 120 && (gameName === 'sorting-challenge' || gameName === 'maze-explorer' || gameName === 'tower-of-hanoi')) {
                    endGame(false);
                }
            }
        }, 1000);
    }

    function loadGameContent() {
        gameArea.innerHTML = '';
        gameControls.classList.remove('hidden');
        
        switch(gameName) {
            case 'sorting-challenge':
                renderSortingChallengeGame();
                break;
            case 'array-search':
                renderArraySearchGame();
                break;
            case 'matrix-operations':
                renderMatrixOperationsGame();
                break;
            case 'string-reversal':
                renderStringReversalGame();
                break;
            case 'palindrome-checker':
                renderPalindromeCheckerGame();
                break;
            case 'anagram-solver':
                renderAnagramSolverGame();
                break;
            case 'stack':
            case 'stack-stacker':
                renderStackGame();
                break;
            case 'balanced-parentheses':
                renderBalancedParenthesesGame();
                break;
            case 'tower-of-hanoi':
                renderTowerOfHanoiGame();
                break;
            case 'queue':
            case 'queue-commander':
                renderQueueGame();
                break;
            case 'print-queue':
                renderPrintQueueGame();
                break;
            case 'breadth-first-search':
                renderBreadthFirstSearchGame();
                break;
            case 'binary-tree-traversal':
                renderBinaryTreeTraversalGame();
                break;
            case 'bst-operations':
                renderBSTOperationsGame();
                break;
            case 'heap-builder':
                renderHeapBuilderGame();
                break;
            case 'maze-explorer':
                renderGraphGame();
                break;
            case 'shortest-path':
                renderShortestPathGame();
                break;
            case 'network-flow':
                renderNetworkFlowGame();
                break;
            case 'hash-table-hunt':
                renderHashTableHuntGame();
                break;
            case 'collision-resolver':
                renderCollisionResolverGame();
                break;
            case 'dictionary-builder':
                renderDictionaryBuilderGame();
                break;
            case 'bubble-sort':
                renderBubbleSortGame();
                break;
            case 'quick-sort':
                renderQuickSortGame();
                break;
            case 'merge-sort':
                renderMergeSortGame();
                break;
            case 'heap-sort':
                renderHeapSortGame();
                break;
            default:
                renderSortingGame();
        }
    }

    function renderSortingChallengeGame() {
        const sizes = generateRandomArray(10);
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Sort the Array';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Click on two bars to swap their positions. Sort from smallest to largest!';
        
        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex items-end justify-center gap-2 h-64 w-full mb-8';
        
        sizes.forEach((size, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar w-10 bg-primary-color rounded-t-lg cursor-pointer hover:bg-secondary-color transition-all duration-200';
            bar.style.height = `${size * 20}px`;
            bar.dataset.value = size;
            bar.dataset.index = index;
            bar.addEventListener('click', handleBarClick);
            arrayContainer.appendChild(bar);
        });
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);

        gameData = { selectedBars: [], currentArray: sizes };
        
        function handleBarClick(e) {
            if (isPaused) return;

            const bar = e.target;
            
            if (gameData.selectedBars.includes(bar)) {
                bar.classList.remove('ring-4', 'ring-yellow-400');
                gameData.selectedBars = gameData.selectedBars.filter(b => b !== bar);
                return;
            }
            
            if (gameData.selectedBars.length < 2) {
                bar.classList.add('ring-4', 'ring-yellow-400');
                gameData.selectedBars.push(bar);
                
                if (gameData.selectedBars.length === 2) {
                    setTimeout(() => {
                        swapBars();
                    }, 500);
                }
            }
        }
        
        function swapBars() {
            const [bar1, bar2] = gameData.selectedBars;
            
            if (bar1 && bar2) {
                const index1 = parseInt(bar1.dataset.index);
                const index2 = parseInt(bar2.dataset.index);

                const value1 = gameData.currentArray[index1];
                const value2 = gameData.currentArray[index2];

                // Swap values in the array
                [gameData.currentArray[index1], gameData.currentArray[index2]] = [gameData.currentArray[index2], gameData.currentArray[index1]];

                // Visually swap bars
                const height1 = bar1.style.height;
                const height2 = bar2.style.height;
                
                bar1.style.height = height2;
                bar2.style.height = height1;
                
                bar1.dataset.value = value2;
                bar2.dataset.value = value1;
            }
            
            // Reset selection
            gameData.selectedBars.forEach(b => b.classList.remove('ring-4', 'ring-yellow-400'));
            gameData.selectedBars = [];
            
            // Check if sorted
            checkIfSorted();
        }
        
        function checkIfSorted() {
            const isSorted = gameData.currentArray.every((val, i) => i === 0 || val >= gameData.currentArray[i - 1]);
            
            if (isSorted) {
                score += 100;
                level++;
                updateHUD();
                showNotification('Great job! Array sorted correctly!', 2000);
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                
                if (attempts <= 0) {
                    endGame(false);
                } else {
                    showNotification('Not quite right. Try again!', 1500);
                }
            }
        }
    }

    function renderArraySearchGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Find the Number';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Click the block containing the target number: `;
        
        const targetEl = document.createElement('span');
        targetEl.className = 'font-bold text-primary-color';
        instruction.appendChild(targetEl);
        
        const size = 10;
        const array = generateRandomArray(size);
        const target = array[Math.floor(Math.random() * size)];
        targetEl.textContent = target;
        
        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex flex-wrap justify-center gap-4 mb-8 w-full max-w-xl';
        
        array.forEach((val, index) => {
            const block = document.createElement('div');
            block.className = 'w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg cursor-pointer hover:bg-primary-color transition-colors duration-200';
            block.textContent = val;
            block.dataset.value = val;
            block.addEventListener('click', () => {
                if (isPaused) return;
                if (parseInt(block.dataset.value) === target) {
                    score += 100;
                    updateHUD();
                    showNotification('Correct! Well done!');
                    endGame(true);
                } else {
                    attempts--;
                    updateHUD();
                    block.classList.remove('bg-gray-700');
                    block.classList.add('bg-red-500');
                    showNotification('Wrong! Try again.');
                    if (attempts <= 0) {
                        endGame(false);
                    }
                }
            });
            arrayContainer.appendChild(block);
        });
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);
    }

    function renderMatrixOperationsGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Matrix Addition';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Enter the sum of the two matrices below. You have 3 attempts.';
        
        const matrixA = generateMatrix(2, 2);
        const matrixB = generateMatrix(2, 2);
        const resultMatrix = addMatrices(matrixA, matrixB);

        container.innerHTML = `
            <div class="flex gap-8 mb-6">
                <div class="matrix-container">
                    <h4 class="font-bold text-center mb-2">Matrix A</h4>
                    ${renderMatrix(matrixA)}
                </div>
                <div class="text-3xl font-bold self-center">+</div>
                <div class="matrix-container">
                    <h4 class="font-bold text-center mb-2">Matrix B</h4>
                    ${renderMatrix(matrixB)}
                </div>
            </div>
            <h4 class="font-bold text-center mb-2">Your Answer</h4>
            <div class="matrix-container mb-6">
                ${renderInputMatrix(2, 2)}
            </div>
            <button id="submit-matrix" class="btn-primary">Submit</button>
        `;
        gameArea.appendChild(container);
        
        document.getElementById('submit-matrix').addEventListener('click', () => {
            if (isPaused) return;
            const userMatrix = getUserInputMatrix(2, 2);
            if (JSON.stringify(userMatrix) === JSON.stringify(resultMatrix)) {
                score += 150;
                updateHUD();
                showNotification('Correct! Matrix sum is right!');
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. The matrix sum is wrong.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        });

        function generateMatrix(rows, cols) {
            return Array.from({ length: rows }, () => 
                Array.from({ length: cols }, () => Math.floor(Math.random() * 10))
            );
        }
        
        function addMatrices(matA, matB) {
            return matA.map((row, i) => row.map((val, j) => val + matB[i][j]));
        }

        function renderMatrix(matrix) {
            return `<div class="grid grid-cols-2 gap-2 text-center text-lg font-bold">${matrix.flat().map(val => `<div class="p-2 border border-gray-600 rounded">${val}</div>`).join('')}</div>`;
        }

        function renderInputMatrix(rows, cols) {
            return `<div class="grid grid-cols-2 gap-2">${Array(rows * cols).fill().map((_, i) => `<input type="number" class="p-2 w-16 bg-gray-700 text-white border border-gray-600 rounded" data-index="${i}">`).join('')}</div>`;
        }

        function getUserInputMatrix(rows, cols) {
            const inputs = Array.from(document.querySelectorAll('.matrix-container input'));
            const matrix = [];
            for (let i = 0; i < rows; i++) {
                matrix.push(inputs.slice(i * cols, (i + 1) * cols).map(input => parseInt(input.value) || 0));
            }
            return matrix;
        }
    }

    function renderStringReversalGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'String Reversal';
        
        const word = getRandomWord();
        const reversedWord = word.split('').reverse().join('');
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Reverse the following string:`;
        
        const wordDisplay = document.createElement('p');
        wordDisplay.className = 'text-4xl font-bold text-primary-color mb-6';
        wordDisplay.textContent = word;

        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex flex-col items-center gap-4';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-primary-color focus:outline-none';
        input.placeholder = 'Type the reversed string';

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary';
        submitBtn.textContent = 'Submit';

        inputContainer.appendChild(input);
        inputContainer.appendChild(submitBtn);

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(wordDisplay);
        container.appendChild(inputContainer);
        gameArea.appendChild(container);

        submitBtn.addEventListener('click', () => {
            if (isPaused) return;
            if (input.value.trim().toLowerCase() === reversedWord.toLowerCase()) {
                score += 100;
                updateHUD();
                showNotification('Correct! You reversed the string!');
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. Try again.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        });

        function getRandomWord() {
            const words = ['algorithm', 'data', 'structure', 'javascript', 'coding', 'challenge'];
            return words[Math.floor(Math.random() * words.length)];
        }
    }

    function renderPalindromeCheckerGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Palindrome Checker';
        
        const word = getRandomWord();
        const isPalindrome = word.split('').reverse().join('') === word;

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Is "${word}" a palindrome?`;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex gap-4';

        const yesBtn = document.createElement('button');
        yesBtn.className = 'btn-primary';
        yesBtn.textContent = 'Yes';
        yesBtn.addEventListener('click', () => handleAnswer(true));

        const noBtn = document.createElement('button');
        noBtn.className = 'btn-secondary';
        noBtn.textContent = 'No';
        noBtn.addEventListener('click', () => handleAnswer(false));
        
        buttonsContainer.appendChild(yesBtn);
        buttonsContainer.appendChild(noBtn);

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(buttonsContainer);
        gameArea.appendChild(container);

        function handleAnswer(userAnswer) {
            if (isPaused) return;
            if (userAnswer === isPalindrome) {
                score += 50;
                updateHUD();
                showNotification('Correct! Great job!');
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. The word is ' + (isPalindrome ? 'a palindrome' : 'not a palindrome') + '.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }

        function getRandomWord() {
            const palindromes = ['racecar', 'level', 'madam', 'stats', 'deified'];
            const nonPalindromes = ['hello', 'world', 'coding', 'challenge'];
            const allWords = [...palindromes, ...nonPalindromes];
            return allWords[Math.floor(Math.random() * allWords.length)];
        }
    }

    function renderAnagramSolverGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Anagram Solver';

        const wordPair = getRandomAnagramPair();
        const word1 = wordPair[0];
        const anagram = wordPair[1];

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Unscramble the following word:`;

        const wordDisplay = document.createElement('p');
        wordDisplay.className = 'text-4xl font-bold text-primary-color mb-6';
        wordDisplay.textContent = anagram.split('').sort(() => 0.5 - Math.random()).join('');

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-primary-color focus:outline-none';
        input.placeholder = 'Enter the correct word';

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary mt-4';
        submitBtn.textContent = 'Submit';
        submitBtn.addEventListener('click', () => {
            if (isPaused) return;
            if (input.value.trim().toLowerCase() === word1.toLowerCase()) {
                score += 100;
                updateHUD();
                showNotification('Correct! You solved the anagram!');
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. Try again.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        });

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(wordDisplay);
        container.appendChild(input);
        container.appendChild(submitBtn);
        gameArea.appendChild(container);

        function getRandomAnagramPair() {
            const pairs = [
                ['listen', 'silent'],
                ['live', 'evil'],
                ['flow', 'wolf'],
                ['act', 'cat'],
                ['heart', 'earth']
            ];
            return pairs[Math.floor(Math.random() * pairs.length)];
        }
    }
    
    function renderBalancedParenthesesGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Balanced Parentheses';
        
        const expression = generateExpression();
        const isBalanced = checkBalance(expression);

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Is the following expression balanced?`;
        
        const expressionDisplay = document.createElement('p');
        expressionDisplay.className = 'text-4xl font-bold text-primary-color mb-6';
        expressionDisplay.textContent = expression;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex gap-4';

        const yesBtn = document.createElement('button');
        yesBtn.className = 'btn-primary';
        yesBtn.textContent = 'Yes';
        yesBtn.addEventListener('click', () => handleAnswer(true));

        const noBtn = document.createElement('button');
        noBtn.className = 'btn-secondary';
        noBtn.textContent = 'No';
        noBtn.addEventListener('click', () => handleAnswer(false));
        
        buttonsContainer.appendChild(yesBtn);
        buttonsContainer.appendChild(noBtn);

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(expressionDisplay);
        container.appendChild(buttonsContainer);
        gameArea.appendChild(container);

        function generateExpression() {
            const balanced = ['()', '()[]{}', '({})', '{[()]}', '()[]{}[{()}]'];
            const unbalanced = ['(', '())', '[(])', '{[}]', '{[(])}'];
            const allExpressions = [...balanced, ...unbalanced];
            return allExpressions[Math.floor(Math.random() * allExpressions.length)];
        }

        function checkBalance(str) {
            const stack = [];
            const map = {
                '(': ')',
                '[': ']',
                '{': '}'
            };

            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (map[char]) {
                    stack.push(char);
                } else {
                    const lastOpen = stack.pop();
                    if (char !== map[lastOpen]) {
                        return false;
                    }
                }
            }
            return stack.length === 0;
        }

        function handleAnswer(userAnswer) {
            if (isPaused) return;
            if (userAnswer === isBalanced) {
                score += 75;
                updateHUD();
                showNotification('Correct! Excellent!');
                endGame(true);
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. The expression is ' + (isBalanced ? 'balanced' : 'not balanced') + '.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }
    }

    function renderTowerOfHanoiGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Tower of Hanoi';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Move all disks from the left pole to the right pole. Only move one disk at a time and do not place a larger disk on a smaller one.';
        
        const gameContainer = document.createElement('div');
        gameContainer.className = 'flex justify-between w-full max-w-2xl h-80 bg-gray-800 rounded-lg p-4';
        
        const poles = [
            { name: 'A', disks: [4, 3, 2, 1] },
            { name: 'B', disks: [] },
            { name: 'C', disks: [] }
        ];
        
        let selectedDisk = null;
        let selectedPoleIndex = null;
        
        function renderPoles() {
            gameContainer.innerHTML = '';
            poles.forEach((pole, poleIndex) => {
                const poleEl = document.createElement('div');
                poleEl.className = 'h-full w-1/3 flex flex-col items-center justify-end p-2 relative';
                poleEl.dataset.index = poleIndex;
                poleEl.addEventListener('click', handlePoleClick);
                
                // Pole base and rod
                const base = document.createElement('div');
                base.className = 'w-full h-4 bg-gray-500 rounded-lg absolute bottom-0';
                const rod = document.createElement('div');
                rod.className = 'w-2 h-full bg-gray-400';
                poleEl.appendChild(rod);
                
                pole.disks.forEach(diskSize => {
                    const disk = document.createElement('div');
                    disk.className = 'disk bg-blue-500 rounded-full cursor-pointer transition-transform duration-200 ease-in-out';
                    disk.style.width = `${diskSize * 20 + 20}px`;
                    disk.style.height = '20px';
                    disk.style.marginBottom = '2px';
                    disk.dataset.size = diskSize;
                    disk.dataset.pole = poleIndex;
                    poleEl.appendChild(disk);
                });
                
                gameContainer.appendChild(poleEl);
            });
        }
        
        function handlePoleClick(e) {
            if (isPaused) return;

            const poleEl = e.currentTarget;
            const poleIndex = parseInt(poleEl.dataset.index);
            
            if (selectedDisk === null) {
                const topDisk = poles[poleIndex].disks[poles[poleIndex].disks.length - 1];
                if (topDisk) {
                    selectedDisk = topDisk;
                    selectedPoleIndex = poleIndex;
                    poleEl.lastChild.classList.add('ring-4', 'ring-yellow-400');
                }
            } else {
                const targetPoleDisks = poles[poleIndex].disks;
                const topDiskOnTarget = targetPoleDisks[targetPoleDisks.length - 1];
                
                if (topDiskOnTarget === undefined || selectedDisk < topDiskOnTarget) {
                    // Valid move
                    const fromPole = poles[selectedPoleIndex].disks;
                    const diskToMove = fromPole.pop();
                    
                    poles[poleIndex].disks.push(diskToMove);
                    
                    score += 10;
                    updateHUD();
                    
                    if (poles[2].disks.length === 4) {
                        showNotification('You won! Tower of Hanoi solved!');
                        endGame(true);
                    }
                } else {
                    showNotification('Invalid move: cannot place a larger disk on a smaller one.');
                    attempts--;
                    updateHUD();
                    if (attempts <= 0) {
                        endGame(false);
                    }
                }
                
                selectedDisk = null;
                selectedPoleIndex = null;
                renderPoles();
            }
        }
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(gameContainer);
        gameArea.appendChild(container);
        renderPoles();
    }

    function renderPrintQueueGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Print Queue';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Click the jobs to print them in the correct FIFO order!';
        
        const jobs = Array.from({ length: 5 }, (_, i) => `Job ${i + 1}`);
        const queue = [...jobs];
        
        const queueContainer = document.createElement('div');
        queueContainer.className = 'flex items-center justify-center p-4 mb-6 w-full max-w-4xl';
        queueContainer.id = 'queue-visualizer';
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(queueContainer);
        gameArea.appendChild(container);

        let nextJobIndex = 0;

        function renderJobs() {
            queueContainer.innerHTML = '';
            jobs.forEach((job, index) => {
                const jobEl = document.createElement('div');
                jobEl.className = 'w-24 p-3 bg-secondary-color text-center rounded-lg mx-2 cursor-pointer hover:scale-105 transition-transform animate-pop';
                jobEl.textContent = job;
                jobEl.dataset.index = index;
                jobEl.addEventListener('click', handleJobClick);
                queueContainer.appendChild(jobEl);
            });
        }
        
        function handleJobClick(e) {
            if (isPaused) return;

            const jobEl = e.target;
            const clickedIndex = parseInt(jobEl.dataset.index);
            
            if (clickedIndex === nextJobIndex) {
                score += 20;
                updateHUD();
                showNotification('Correct! Job printed.');
                jobEl.remove();
                nextJobIndex++;
                
                if (nextJobIndex === jobs.length) {
                    showNotification('All jobs printed successfully!');
                    endGame(true);
                }
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. Thats not the next job in the queue.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }
        
        renderJobs();
    }

    function renderBreadthFirstSearchGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Breadth-First Search';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Click the nodes in the correct BFS order, starting from A!';
        
        const graph = {
            'A': ['B', 'C'],
            'B': ['D', 'E'],
            'C': ['F'],
            'D': [],
            'E': ['F'],
            'F': []
        };
        
        const nodes = Object.keys(graph);
        const bfsOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
        let currentStep = 0;
        
        const graphContainer = document.createElement('div');
        graphContainer.className = 'relative w-full h-80 max-w-xl';
        
        nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-bold cursor-pointer';
            nodeEl.textContent = node;
            nodeEl.dataset.node = node;
            
            const positions = {
                'A': 'top-[10%] left-[50%]',
                'B': 'top-[40%] left-[20%]',
                'C': 'top-[40%] left-[80%]',
                'D': 'top-[70%] left-[10%]',
                'E': 'top-[70%] left-[30%]',
                'F': 'top-[70%] left-[70%]'
            };
            nodeEl.className += ` absolute transform -translate-x-1/2 -translate-y-1/2 ${positions[node]}`;
            
            nodeEl.addEventListener('click', handleNodeClick);
            graphContainer.appendChild(nodeEl);
        });
        
        function handleNodeClick(e) {
            if (isPaused) return;

            const clickedNode = e.target.dataset.node;
            if (clickedNode === bfsOrder[currentStep]) {
                score += 50;
                updateHUD();
                showNotification(`Correct! Visited ${clickedNode}`);
                e.target.classList.add('bg-green-500');
                e.target.style.pointerEvents = 'none';
                currentStep++;
                if (currentStep === bfsOrder.length) {
                    endGame(true);
                }
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. Remember, BFS explores level by level.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(graphContainer);
        gameArea.appendChild(container);
    }

    function renderBinaryTreeTraversalGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Binary Tree Traversal';
        
        const tree = {
            value: 10,
            left: {
                value: 5,
                left: { value: 3, left: null, right: null },
                right: { value: 7, left: null, right: null }
            },
            right: {
                value: 15,
                left: { value: 12, left: null, right: null },
                right: { value: 18, left: null, right: null }
            }
        };
        
        const traversals = {
            'In-Order': [3, 5, 7, 10, 12, 15, 18],
            'Pre-Order': [10, 5, 3, 7, 15, 12, 18],
            'Post-Order': [3, 7, 5, 12, 18, 15, 10]
        };
        
        const traversalType = Object.keys(traversals)[Math.floor(Math.random() * 3)];
        const correctOrder = traversals[traversalType];
        let currentStep = 0;

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = `Click the nodes in ${traversalType} traversal order.`;
        
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-container w-full h-80 max-w-xl flex items-center justify-center mb-6';
        
        const nodes = renderTreeVisual(tree);
        nodes.forEach(nodeEl => {
            nodeEl.addEventListener('click', handleNodeClick);
            treeContainer.appendChild(nodeEl);
        });
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(treeContainer);
        gameArea.appendChild(container);

        function handleNodeClick(e) {
            if (isPaused) return;

            const clickedValue = parseInt(e.target.textContent);
            if (clickedValue === correctOrder[currentStep]) {
                score += 50;
                updateHUD();
                showNotification(`Correct! Visited ${clickedValue}`);
                e.target.classList.add('bg-green-500');
                e.target.style.pointerEvents = 'none';
                currentStep++;
                if (currentStep === correctOrder.length) {
                    endGame(true);
                }
            } else {
                attempts--;
                updateHUD();
                showNotification('Incorrect. That is not the next node.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }
    }
    
    function renderTreeVisual(tree) {
        const nodes = [];
        function createNode(value, position) {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-bold cursor-pointer';
            nodeEl.textContent = value;
            nodeEl.dataset.value = value;
            nodeEl.className += ` absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`;
            return nodeEl;
        }

        // Simple hardcoded positions for the example tree
        nodes.push(createNode(10, 'top-[10%] left-[50%]'));
        nodes.push(createNode(5, 'top-[40%] left-[25%]'));
        nodes.push(createNode(15, 'top-[40%] left-[75%]'));
        nodes.push(createNode(3, 'top-[70%] left-[15%]'));
        nodes.push(createNode(7, 'top-[70%] left-[35%]'));
        nodes.push(createNode(12, 'top-[70%] left-[65%]'));
        nodes.push(createNode(18, 'top-[70%] left-[85%]'));
        
        return nodes;
    }


    function renderBSTOperationsGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'BST Operations';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Follow the steps to insert or search for a number in the Binary Search Tree.';
        
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-container w-full h-80 max-w-xl flex items-center justify-center mb-6';
        
        const action = Math.random() < 0.5 ? 'insert' : 'search';
        const value = Math.floor(Math.random() * 20);
        
        const tree = { value: 10, left: null, right: null };
        const values = [5, 15, 3, 7];
        values.forEach(val => insertIntoTree(tree, val));
        
        const steps = getBSTSteps(tree, value, action);
        let currentStep = 0;
        
        const stepInstruction = document.createElement('p');
        stepInstruction.className = 'font-bold text-lg mb-4 text-center';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn-primary mt-4';
        continueBtn.textContent = 'Next Step';
        continueBtn.addEventListener('click', () => {
            if (isPaused) return;

            if (currentStep < steps.length) {
                const step = steps[currentStep];
                if (step.action === 'move') {
                    const nodeEl = document.querySelector(`[data-value="${step.node}"]`);
                    if (nodeEl) {
                        document.querySelectorAll('.node').forEach(n => n.classList.remove('ring-4', 'ring-primary-color'));
                        nodeEl.classList.add('ring-4', 'ring-primary-color');
                    }
                }
                stepInstruction.textContent = step.text;
                currentStep++;
            } else {
                score += 100;
                updateHUD();
                showNotification('Congratulations! Operation complete.');
                endGame(true);
            }
        });

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(treeContainer);
        container.appendChild(stepInstruction);
        container.appendChild(continueBtn);
        gameArea.appendChild(container);
        
        renderTreeVisual(tree);
    }
    
    function getBSTSteps(root, value, action) {
        const steps = [];
        let current = root;
        steps.push({ action: 'move', node: current.value, text: `Start at the root (${current.value}).` });

        while (current) {
            if (value === current.value) {
                steps.push({ action: 'final', text: `Found the value! The operation is complete.` });
                return steps;
            }
            if (value < current.value) {
                if (current.left) {
                    current = current.left;
                    steps.push({ action: 'move', node: current.value, text: `${value} is less than ${current.value}. Move to the left child.` });
                } else {
                    if (action === 'insert') {
                        steps.push({ action: 'final', text: `Found an empty spot. Insert ${value} here.` });
                        return steps;
                    } else {
                        steps.push({ action: 'final', text: `Value not found. Reached a null node.` });
                        return steps;
                    }
                }
            } else {
                if (current.right) {
                    current = current.right;
                    steps.push({ action: 'move', node: current.value, text: `${value} is greater than ${current.value}. Move to the right child.` });
                } else {
                    if (action === 'insert') {
                        steps.push({ action: 'final', text: `Found an empty spot. Insert ${value} here.` });
                        return steps;
                    } else {
                        steps.push({ action: 'final', text: `Value not found. Reached a null node.` });
                        return steps;
                    }
                }
            }
        }
        return steps;
    }

    function renderHeapBuilderGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Heap Builder';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Drag and drop the numbers to create a valid Max-Heap.';

        const numbers = generateRandomArray(7);
        
        const numberContainer = document.createElement('div');
        numberContainer.className = 'flex flex-wrap justify-center gap-4 mb-8';
        
        numbers.forEach(val => {
            const numberEl = document.createElement('div');
            numberEl.className = 'w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg text-white font-bold cursor-grab';
            numberEl.textContent = val;
            numberEl.draggable = true;
            numberEl.dataset.value = val;
            numberEl.addEventListener('dragstart', handleDragStart);
            numberContainer.appendChild(numberEl);
        });

        const heapContainer = document.createElement('div');
        heapContainer.className = 'grid grid-cols-7 gap-4 w-full max-w-4xl h-40 border border-dashed border-gray-500 rounded-lg p-4';
        heapContainer.addEventListener('dragover', handleDragOver);
        heapContainer.addEventListener('drop', handleDrop);
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(numberContainer);
        container.appendChild(heapContainer);
        gameArea.appendChild(container);

        function handleDragStart(e) {
            if (isPaused) return;
            e.dataTransfer.setData('text/plain', e.target.dataset.value);
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDrop(e) {
            if (isPaused) return;
            e.preventDefault();
            const value = e.dataTransfer.getData('text/plain');
            const droppedEl = document.querySelector(`[data-value="${value}"]`);
            heapContainer.appendChild(droppedEl);
            
            if (isMaxHeap()) {
                score += 200;
                updateHUD();
                showNotification('Success! You built a Max-Heap.');
                endGame(true);
            }
        }
        
        function isMaxHeap() {
            const heapElements = Array.from(heapContainer.children);
            const heapArray = heapElements.map(el => parseInt(el.dataset.value));
            
            if (heapArray.length !== numbers.length) {
                return false;
            }
            
            for (let i = 0; i < heapArray.length; i++) {
                const parent = heapArray[i];
                const leftChildIndex = 2 * i + 1;
                const rightChildIndex = 2 * i + 2;
                
                if (leftChildIndex < heapArray.length && heapArray[leftChildIndex] > parent) {
                    return false;
                }
                
                if (rightChildIndex < heapArray.length && heapArray[rightChildIndex] > parent) {
                    return false;
                }
            }
            
            return true;
        }
    }

    function renderShortestPathGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Shortest Path';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Click the nodes in the shortest path from A to F!';

        const graph = {
            'A': { 'B': 4, 'C': 2 },
            'B': { 'A': 4, 'E': 3, 'D': 5 },
            'C': { 'A': 2, 'D': 8 },
            'D': { 'B': 5, 'C': 8, 'E': 1, 'F': 6 },
            'E': { 'B': 3, 'D': 1, 'F': 2 },
            'F': { 'D': 6, 'E': 2 }
        };

        const graphContainer = document.createElement('div');
        graphContainer.className = 'relative w-full h-80 max-w-xl';
        
        const nodes = Object.keys(graph);
        const positions = {
            'A': 'top-[10%] left-[20%]',
            'B': 'top-[10%] left-[60%]',
            'C': 'top-[40%] left-[20%]',
            'D': 'top-[40%] left-[80%]',
            'E': 'top-[70%] left-[60%]',
            'F': 'top-[70%] left-[20%]'
        };
        
        nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-bold cursor-pointer';
            nodeEl.textContent = node;
            nodeEl.dataset.node = node;
            nodeEl.className += ` absolute transform -translate-x-1/2 -translate-y-1/2 ${positions[node]}`;
            nodeEl.addEventListener('click', handleNodeClick);
            graphContainer.appendChild(nodeEl);
        });
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(graphContainer);
        gameArea.appendChild(container);

        const correctPath = ['A', 'C', 'D', 'E', 'F'];
        let userPath = [];

        function handleNodeClick(e) {
            if (isPaused) return;

            const node = e.target.dataset.node;
            userPath.push(node);
            e.target.classList.add('bg-green-500');
            e.target.style.pointerEvents = 'none';

            if (userPath.length === correctPath.length && JSON.stringify(userPath) === JSON.stringify(correctPath)) {
                score += 200;
                updateHUD();
                showNotification('Correct! You found the shortest path!');
                endGame(true);
            } else if (userPath.length > correctPath.length || userPath[userPath.length - 1] !== correctPath[userPath.length - 1]) {
                attempts--;
                updateHUD();
                showNotification('Incorrect path. Try again.');
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        }
    }

    function renderNetworkFlowGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Network Flow';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Find the maximum flow from S to T by adjusting edge capacities.';
        
        const graph = {
            'S': { 'A': 10, 'B': 10 },
            'A': { 'C': 8, 'D': 2, 'B': 4 },
            'B': { 'A': 4, 'D': 9 },
            'C': { 'T': 10 },
            'D': { 'C': 6, 'T': 10 },
            'T': {}
        };

        gameArea.innerHTML = `
            <div class="network-flow-container flex flex-col items-center w-full max-w-xl">
                <p class="text-xl text-gray-400 mb-4">This game is a complex interactive puzzle. Use the Network Flow visualizer in the Practice page for a hands-on experience!</p>
                <a href="#practice" class="btn-primary mt-4">Go to Practice Page</a>
            </div>
        `;
    }

    function renderHashTableHuntGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Hash Table Hunt';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Find the correct bucket for the given key-value pair.';
        
        const tableSize = 10;
        const keys = ['apple', 'banana', 'orange', 'grape', 'kiwi', 'pear', 'lemon', 'lime', 'melon', 'mango'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        const value = 'A fruit';
        const hash = key.length % tableSize;

        container.innerHTML = `
            <div class="mb-6">
                <p class="text-xl font-bold">Key: <span class="text-primary-color">${key}</span></p>
                <p class="text-xl font-bold">Value: <span class="text-primary-color">${value}</span></p>
            </div>
            <p class="text-lg font-medium mb-4">Click the correct bucket where this pair should be stored.</p>
            <div id="hash-table-grid" class="grid grid-cols-5 gap-4 w-full max-w-xl">
                ${Array(tableSize).fill().map((_, i) => `
                    <div class="bucket p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-primary-color transition-colors duration-200 text-center" data-index="${i}">Bucket ${i}</div>
                `).join('')}
            </div>
        `;
        gameArea.appendChild(container);

        document.getElementById('hash-table-grid').addEventListener('click', (e) => {
            if (isPaused) return;

            if (e.target.classList.contains('bucket')) {
                const index = parseInt(e.target.dataset.index);
                if (index === hash) {
                    score += 100;
                    updateHUD();
                    showNotification('Correct! The hash function is `key.length % 10`.');
                    endGame(true);
                } else {
                    attempts--;
                    updateHUD();
                    showNotification('Incorrect. Thats not the right bucket.');
                    if (attempts <= 0) {
                        endGame(false);
                    }
                }
            }
        });
    }

    function renderCollisionResolverGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Collision Resolver';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Find the empty slot for the new item. Collision is handled with linear probing.';

        const table = [null, 'A', 'B', 'C', null, 'D', null, null, null, null];
        const key = 'E';
        const hash = 1;
        const correctIndex = 4;

        container.innerHTML = `
            <p class="text-xl font-bold mb-4">New Key to Insert: <span class="text-primary-color">${key}</span></p>
            <p class="text-lg font-medium mb-4">Hash Index: ${hash}</p>
            <p class="text-lg font-medium mb-4">Click the empty slot to insert it.</p>
            <div id="collision-grid" class="grid grid-cols-5 gap-4 w-full max-w-xl">
                ${table.map((val, i) => `
                    <div class="slot p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-primary-color transition-colors duration-200 text-center" data-index="${i}">
                        ${val || 'Empty'}
                    </div>
                `).join('')}
            </div>
        `;
        gameArea.appendChild(container);

        document.getElementById('collision-grid').addEventListener('click', (e) => {
            if (isPaused) return;

            if (e.target.classList.contains('slot')) {
                const index = parseInt(e.target.dataset.index);
                if (index === correctIndex) {
                    score += 150;
                    updateHUD();
                    showNotification('Correct! You found the right slot.');
                    endGame(true);
                } else {
                    attempts--;
                    updateHUD();
                    showNotification('Incorrect. The hash collision was not resolved correctly.');
                    if (attempts <= 0) {
                        endGame(false);
                    }
                }
            }
        });
    }

    function renderDictionaryBuilderGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Dictionary Builder';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Add key-value pairs to the dictionary and find them.';

        const dictionary = {};
        
        container.innerHTML = `
            <div class="flex gap-4 mb-4">
                <input type="text" id="key-input" placeholder="Key" class="p-2 rounded bg-gray-700 text-white w-24">
                <input type="text" id="value-input" placeholder="Value" class="p-2 rounded bg-gray-700 text-white w-24">
                <button id="add-btn" class="btn-primary">Add</button>
            </div>
            <div class="flex gap-4 mb-6">
                <input type="text" id="search-input" placeholder="Search key" class="p-2 rounded bg-gray-700 text-white w-24">
                <button id="search-btn" class="btn-secondary">Search</button>
            </div>
            <div id="dictionary-display" class="p-4 bg-gray-800 rounded-lg w-full max-w-md min-h-24">
                <p class="text-gray-500 text-center">Dictionary is empty</p>
            </div>
            <p id="result-message" class="mt-4 text-center font-bold"></p>
        `;
        gameArea.appendChild(container);

        document.getElementById('add-btn').addEventListener('click', () => {
            if (isPaused) return;

            const key = document.getElementById('key-input').value.trim();
            const value = document.getElementById('value-input').value.trim();
            if (key && value) {
                dictionary[key] = value;
                showNotification(`Added ${key}: ${value}`);
                renderDictionary();
                score += 10;
                updateHUD();
            }
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            if (isPaused) return;

            const key = document.getElementById('search-input').value.trim();
            const result = document.getElementById('result-message');
            if (dictionary[key]) {
                result.textContent = `Found: ${dictionary[key]}`;
                result.classList.remove('text-red-500');
                result.classList.add('text-green-500');
                score += 20;
                updateHUD();
                if (score >= 100) endGame(true);
            } else {
                result.textContent = 'Not Found';
                result.classList.remove('text-green-500');
                result.classList.add('text-red-500');
                attempts--;
                updateHUD();
                if (attempts <= 0) endGame(false);
            }
        });

        function renderDictionary() {
            const display = document.getElementById('dictionary-display');
            const entries = Object.entries(dictionary);
            if (entries.length === 0) {
                display.innerHTML = '<p class="text-gray-500 text-center">Dictionary is empty</p>';
            } else {
                display.innerHTML = entries.map(([key, value]) => `<div class="p-1 border-b border-gray-700">${key}: ${value}</div>`).join('');
            }
        }
    }
    
    async function renderBubbleSortGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Bubble Sort';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Watch the algorithm sort the array by repeatedly swapping adjacent elements.';

        const array = generateRandomArray(10);
        let currentArray = [...array];

        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex items-end justify-center gap-2 h-64 w-full mb-8';

        function renderArray(arr, compareIndexes = [], swapIndexes = [], sortedIndexes = []) {
            arrayContainer.innerHTML = '';
            const maxVal = Math.max(...arr);
            arr.forEach((val, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar w-10 rounded-t-lg transition-all duration-200 flex items-end justify-center text-white';
                bar.style.height = `${(val / maxVal) * 200}px`;
                bar.textContent = val;
                
                if (sortedIndexes.includes(index)) {
                    bar.classList.add('bg-green-500');
                } else if (swapIndexes.includes(index)) {
                    bar.classList.add('bg-red-500');
                } else if (compareIndexes.includes(index)) {
                    bar.classList.add('bg-yellow-500');
                } else {
                    bar.classList.add('bg-primary-color');
                }
                arrayContainer.appendChild(bar);
            });
        }

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);
        renderArray(currentArray);
        
        // Add a "Start" button for the user to initiate the visualization
        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary mt-4';
        startBtn.textContent = 'Start Visualization';
        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            startBtn.textContent = 'Visualizing...';

            let n = currentArray.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (isPaused) { await waitForResume(); }
                    renderArray(currentArray, [j, j + 1]);
                    await sleep(500);

                    if (currentArray[j] > currentArray[j + 1]) {
                        [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
                        renderArray(currentArray, [], [j, j + 1]);
                        await sleep(500);
                    }
                }
                renderArray(currentArray, [], [], Array.from({length: i+1}, (_, k) => n - 1 - k));
            }
            renderArray(currentArray, [], [], Array.from({length: n}, (_, k) => k));

            showNotification('Bubble Sort Complete!');
            endGame(true);
        });
        gameArea.appendChild(startBtn);
    }
    
    async function renderQuickSortGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Quick Sort';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Watch the algorithm sort the array by picking a pivot and partitioning.';

        const array = generateRandomArray(10);
        let currentArray = [...array];

        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex items-end justify-center gap-2 h-64 w-full mb-8';

        function renderArray(arr, pivotIndex = -1, low = -1, high = -1, sortedIndexes = []) {
            arrayContainer.innerHTML = '';
            const maxVal = Math.max(...arr);
            arr.forEach((val, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar w-10 rounded-t-lg transition-all duration-200 flex items-end justify-center text-white';
                bar.style.height = `${(val / maxVal) * 200}px`;
                bar.textContent = val;
                
                if (sortedIndexes.includes(index)) {
                    bar.classList.add('bg-green-500');
                } else if (index === pivotIndex) {
                    bar.classList.add('bg-red-500');
                } else if (index >= low && index <= high) {
                    bar.classList.add('bg-yellow-500');
                } else {
                    bar.classList.add('bg-primary-color');
                }
                arrayContainer.appendChild(bar);
            });
        }

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);
        renderArray(currentArray);

        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary mt-4';
        startBtn.textContent = 'Start Visualization';
        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            startBtn.textContent = 'Visualizing...';

            await quickSort(currentArray, 0, currentArray.length - 1, renderArray, isPaused);

            showNotification('Quick Sort Complete!');
            endGame(true);
        });
        gameArea.appendChild(startBtn);
    }
    
    async function renderMergeSortGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Merge Sort';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Watch the algorithm divide, sort, and merge subarrays.';

        const array = generateRandomArray(10);
        let currentArray = [...array];
        const sorted = Array.from({length: array.length}, (_,i) => -1);

        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex items-end justify-center gap-2 h-64 w-full mb-8';

        function renderArray(arr, highlightIndexes = [], sortedIndexes = []) {
            arrayContainer.innerHTML = '';
            const maxVal = Math.max(...array);
            arr.forEach((val, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar w-10 rounded-t-lg transition-all duration-200 flex items-end justify-center text-white';
                bar.style.height = `${(val / maxVal) * 200}px`;
                bar.textContent = val;
                
                if (sortedIndexes.includes(index)) {
                    bar.classList.add('bg-green-500');
                } else if (highlightIndexes.includes(index)) {
                    bar.classList.add('bg-yellow-500');
                } else {
                    bar.classList.add('bg-primary-color');
                }
                arrayContainer.appendChild(bar);
            });
        }

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);
        renderArray(currentArray);

        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary mt-4';
        startBtn.textContent = 'Start Visualization';
        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            startBtn.textContent = 'Visualizing...';

            await mergeSortVisual(currentArray, 0, currentArray.length - 1, renderArray, isPaused, sorted);

            showNotification('Merge Sort Complete!');
            endGame(true);
        });
        gameArea.appendChild(startBtn);
    }
    
    async function renderHeapSortGame() {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Heap Sort';

        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Watch the algorithm build a max heap and sort the array.';

        const array = generateRandomArray(10);
        let currentArray = [...array];

        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'flex items-end justify-center gap-2 h-64 w-full mb-8';
        
        function renderArray(arr, heapEnd = -1, sortedIndexes = []) {
            arrayContainer.innerHTML = '';
            const maxVal = Math.max(...array);
            arr.forEach((val, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar w-10 rounded-t-lg transition-all duration-200 flex items-end justify-center text-white';
                bar.style.height = `${(val / maxVal) * 200}px`;
                bar.textContent = val;

                if (sortedIndexes.includes(index)) {
                    bar.classList.add('bg-green-500');
                } else if (index > heapEnd) {
                    bar.classList.add('bg-yellow-500');
                } else {
                    bar.classList.add('bg-primary-color');
                }
                arrayContainer.appendChild(bar);
            });
        }

        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(arrayContainer);
        gameArea.appendChild(container);
        renderArray(currentArray);
        
        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary mt-4';
        startBtn.textContent = 'Start Visualization';
        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            startBtn.textContent = 'Visualizing...';

            await heapSort(currentArray, renderArray, isPaused);

            showNotification('Heap Sort Complete!');
            endGame(true);
        });
        gameArea.appendChild(startBtn);
    }
    
    // Re-useable sorting logic for visualization games
    async function swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    async function quickSort(arr, low, high, render, paused) {
        if (low < high) {
            if (paused) { await waitForResume(); }
            let pi = await partition(arr, low, high, render, paused);
            await quickSort(arr, low, pi - 1, render, paused);
            await quickSort(arr, pi + 1, high, render, paused);
        } else if (low === high) {
            render(arr, -1, -1, -1, [low]);
        }
    }
    
    async function partition(arr, low, high, render, paused) {
        let pivot = arr[high];
        let i = (low - 1);
        
        for (let j = low; j <= high - 1; j++) {
            if (paused) { await waitForResume(); }
            render(arr, high, low, high);
            await sleep(300);

            if (arr[j] < pivot) {
                i++;
                await swap(arr, i, j);
                render(arr, high, low, high);
                await sleep(300);
            }
        }
        await swap(arr, i + 1, high);
        render(arr, high, low, high);
        await sleep(300);

        return (i + 1);
    }
    
    async function mergeSortVisual(arr, low, high, render, paused, sortedArr) {
        if (low >= high) return;
        
        const mid = Math.floor((low + high) / 2);
        await mergeSortVisual(arr, low, mid, render, paused, sortedArr);
        await mergeSortVisual(arr, mid + 1, high, render, paused, sortedArr);
        await mergeVisual(arr, low, mid, high, render, paused, sortedArr);
    }
    
    async function mergeVisual(arr, low, mid, high, render, paused, sortedArr) {
        let i = low;
        let j = mid + 1;
        let k = low;
        let temp = [];

        render(arr, Array.from({length: high - low + 1}, (_, i) => low + i));
        await sleep(500);

        while (i <= mid && j <= high) {
            if (paused) { await waitForResume(); }
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }
        while (i <= mid) {
            if (paused) { await waitForResume(); }
            temp[k++] = arr[i++];
        }
        while (j <= high) {
            if (paused) { await waitForResume(); }
            temp[k++] = arr[j++];
        }
        for (let l = low; l <= high; l++) {
            arr[l] = temp[l];
            sortedArr[l] = 1;
            render(arr, [], Array.from({length: high-low+1}, (_,i) => low+i));
            await sleep(100);
        }
    }
    
    async function heapify(arr, n, i, render, paused, heapEnd) {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n && arr[l] > arr[largest]) {
            largest = l;
        }
        if (r < n && arr[r] > arr[largest]) {
            largest = r;
        }

        if (largest !== i) {
            if (paused) { await waitForResume(); }
            await swap(arr, i, largest);
            render(arr, heapEnd);
            await sleep(300);
            await heapify(arr, n, largest, render, paused, heapEnd);
        }
    }
    
    async function heapSort(arr, render, paused) {
        let n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if (paused) { await waitForResume(); }
            await heapify(arr, n, i, render, paused, n-1);
        }

        for (let i = n - 1; i > 0; i--) {
            if (paused) { await waitForResume(); }
            await swap(arr, 0, i);
            render(arr, i - 1, Array.from({length: n-i}, (_, k) => i + k));
            await sleep(300);
            await heapify(arr, i, 0, render, paused, i - 1);
        }
        render(arr, -1, Array.from({length: n}, (_, k) => k));
    }
    
    function generateRandomArray(size) {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
    }

    // Game functions to be implemented
    function renderSortingGame() {
        // This is the original generic sorting game from the previous file.
        // I will keep this function as a fallback and for the main Sorting topic link.
        // It can be removed if you want to use the new specific ones.
        renderSortingChallengeGame();
    }

    function renderStackGame() {
         // This is the original stack game. I will keep it.
         const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Stack Operations';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Push elements onto the stack and pop them in the correct order (LIFO)!';
        
        const stackContainer = document.createElement('div');
        stackContainer.className = 'flex flex-col-reverse items-center justify-start border-b-2 border-primary-color p-4 mb-6 min-h-64 w-full max-w-md';
        stackContainer.id = 'stack-visualizer';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex gap-2 w-full max-w-md';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'stack-input';
        input.placeholder = 'Element to push';
        input.className = 'flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-primary-color focus:outline-none';
        
        const pushBtn = document.createElement('button');
        pushBtn.id = 'push-btn';
        pushBtn.className = 'btn-primary';
        pushBtn.textContent = 'Push';
        
        const popBtn = document.createElement('button');
        popBtn.id = 'pop-btn';
        popBtn.className = 'btn-secondary';
        popBtn.textContent = 'Pop';
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(pushBtn);
        inputContainer.appendChild(popBtn);
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(stackContainer);
        container.appendChild(inputContainer);
        gameArea.appendChild(container);
        
        const stack = [];
        
        function renderStack() {
            stackContainer.innerHTML = '';
            stack.forEach(val => {
                const element = document.createElement('div');
                element.className = 'w-24 p-3 bg-secondary-color text-center rounded-lg mb-2 animate-pop';
                element.textContent = val;
                stackContainer.appendChild(element);
            });
        }
        
        pushBtn.addEventListener('click', () => {
            if (isPaused) return;

            const val = input.value.trim();
            if (val) {
                stack.push(val);
                renderStack();
                input.value = '';
                score += 10;
                updateHUD();
            }
        });
        
        popBtn.addEventListener('click', () => {
            if (isPaused) return;

            if (stack.length > 0) {
                const val = stack.pop();
                renderStack();
                showNotification(`Popped: ${val}`);
                score += 15;
                updateHUD();
                
                // Check win condition
                if (score >= 100) {
                    endGame(true);
                }
            } else {
                showNotification('Stack is empty!');
                attempts--;
                updateHUD();
                
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        });
    }

    function renderQueueGame() {
        // This is the original queue game. I will keep it.
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Queue Operations';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Enqueue tasks and dequeue them in the correct order (FIFO)!';
        
        const queueContainer = document.createElement('div');
        queueContainer.className = 'flex items-center justify-center border-x-2 border-primary-color p-4 mb-6 min-h-32 w-full max-w-4xl';
        queueContainer.id = 'queue-visualizer';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex gap-2 w-full max-w-md';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'queue-input';
        input.placeholder = 'Task to add';
        input.className = 'flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-primary-color focus:outline-none';
        
        const enqueueBtn = document.createElement('button');
        enqueueBtn.id = 'enqueue-btn';
        enqueueBtn.className = 'btn-primary';
        enqueueBtn.textContent = 'Enqueue';
        
        const dequeueBtn = document.createElement('button');
        dequeueBtn.id = 'dequeue-btn';
        dequeueBtn.className = 'btn-secondary';
        dequeueBtn.textContent = 'Dequeue';
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(enqueueBtn);
        inputContainer.appendChild(dequeueBtn);
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(queueContainer);
        container.appendChild(inputContainer);
        gameArea.appendChild(container);
        
        const queue = [];
        
        function renderQueue() {
            queueContainer.innerHTML = '';
            queue.forEach((val, index) => {
                const element = document.createElement('div');
                element.className = 'w-24 p-3 bg-secondary-color text-center rounded-lg mx-2 animate-pop';
                element.textContent = val;
                element.dataset.index = index;
                queueContainer.appendChild(element);
            });
        }
        
        enqueueBtn.addEventListener('click', () => {
            if (isPaused) return;

            const val = input.value.trim();
            if (val) {
                queue.push(val);
                renderQueue();
                input.value = '';
                score += 10;
                updateHUD();
            }
        });
        
        dequeueBtn.addEventListener('click', () => {
            if (isPaused) return;

            if (queue.length > 0) {
                const val = queue.shift();
                renderQueue();
                showNotification(`Dequeued: ${val}`);
                score += 15;
                updateHUD();
                
                // Check win condition
                if (score >= 100) {
                    endGame(true);
                }
            } else {
                showNotification('Queue is empty!');
                attempts--;
                updateHUD();
                
                if (attempts <= 0) {
                    endGame(false);
                }
            }
        });
    }

    function renderGraphGame() {
        // Original Maze Explorer game.
        const container = document.createElement('div');
        container.className = 'w-full flex flex-col items-center';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6';
        title.textContent = 'Maze Explorer';
        
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-400 mb-6';
        instruction.textContent = 'Find the shortest path from Start to End by clicking on adjacent cells.';
        
        const mazeContainer = document.createElement('div');
        mazeContainer.className = 'grid grid-cols-5 gap-1 w-full max-w-md mb-6';
        mazeContainer.id = 'maze-container';
        
        // Create a simple maze
        const maze = [
            ['S', 0, 1, 0, 0],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1],
            [0, 0, 0, 0, 'E']
        ];
        
        maze.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'w-12 h-12 border border-gray-600 flex items-center justify-center text-sm font-bold';
                
                if (cell === 'S') {
                    cellDiv.textContent = 'S';
                    cellDiv.classList.add('bg-green-500', 'text-white');
                } else if (cell === 'E') {
                    cellDiv.textContent = 'E';
                    cellDiv.classList.add('bg-red-500', 'text-white');
                } else if (cell === 1) {
                    cellDiv.classList.add('bg-gray-700');
                } else {
                    cellDiv.classList.add('bg-gray-200', 'dark\\:bg-gray-800', 'cursor-pointer', 'hover:bg-blue-200', 'dark\\:hover:bg-blue-800');
                    cellDiv.dataset.row = rowIndex;
                    cellDiv.dataset.col = colIndex;
                    cellDiv.addEventListener('click', markPath);
                }
                
                mazeContainer.appendChild(cellDiv);
            });
        });
        
        const controls = document.createElement('div');
        controls.className = 'flex gap-3';
        
        const solveBtn = document.createElement('button');
        solveBtn.id = 'solve-btn';
        solveBtn.className = 'btn-primary';
        solveBtn.textContent = 'Solve';
        
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-btn';
        resetBtn.className = 'btn-secondary';
        resetBtn.textContent = 'Reset';
        
        controls.appendChild(solveBtn);
        controls.appendChild(resetBtn);
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(mazeContainer);
        container.appendChild(controls);
        gameArea.appendChild(container);
        
        const path = [];
        
        function markPath(e) {
            if (isPaused) return;

            const cell = e.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            // Check if adjacent to current position
            const lastPos = path.length > 0 ? path[path.length - 1] : {row: 0, col: 0};
            const isAdjacent = 
                (Math.abs(row - lastPos.row) === 1 && col === lastPos.col) || 
                (Math.abs(col - lastPos.col) === 1 && row === lastPos.row);
            
            if (isAdjacent || path.length === 0) { // Allow first move from 'S'
                cell.classList.add('bg-blue-500', 'text-white');
                path.push({row, col});
                
                // Check if reached end
                if (row === 4 && col === 4) {
                    score += 150;
                    updateHUD();
                    showNotification('Congratulations! You found the path!', 2000);
                    setTimeout(() => endGame(true), 1500);
                }
            } else {
                showNotification('Move must be adjacent to your current position!');
            }
        }
        
        solveBtn.addEventListener('click', () => {
            if (isPaused) return;

            usedHint = true;
            // Simple BFS solution
            const solutionPath = [
                {row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1},
                {row: 2, col: 2}, {row: 2, col: 3}, {row: 3, col: 3},
                {row: 4, col: 3}, {row: 4, col: 4}
            ];
            
            solutionPath.forEach(pos => {
                const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
                if (cell) {
                    setTimeout(() => {
                        cell.classList.add('bg-green-500', 'text-white', 'animate-pop');
                    }, 300 * solutionPath.indexOf(pos));
                }
            });
            
            score += 50; // Partial credit for using hint
            updateHUD();
        });
        
        resetBtn.addEventListener('click', () => {
            if (isPaused) return;

            document.querySelectorAll('#maze-container div').forEach(cell => {
                if (!cell.classList.contains('bg-green-500') && 
                    !cell.classList.contains('bg-red-500') && 
                    !cell.classList.contains('bg-gray-700')) {
                    cell.classList.remove('bg-blue-500', 'text-white');
                }
            });
            path.length = 0;
        });
    }

    function endGame(wasSuccessful) {
        clearInterval(gameInterval);
        
        // Save score
        if (currentUser && wasSuccessful) {
            const newScore = { 
                username: currentUser.username, 
                game: gameName, 
                score: score,
                level: level,
                time: time,
                date: new Date().toISOString(),
                usedHint: usedHint
            };
            scores.push(newScore);
            
            // Update user stats
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].gamesPlayed = (users[userIndex].gamesPlayed || 0) + 1;
                if (wasSuccessful) {
                    users[userIndex].wins = (users[userIndex].wins || 0) + 1;
                }
            }
            
            // Check for achievements
            checkAchievements();
            saveToLocalStorage();
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        
        // Show game results
        showModal(
            wasSuccessful ? 'Level Complete!' : 'Game Over', 
            wasSuccessful ? 
                `Congratulations! You completed level ${level} with a score of ${score}.` : 
                `Time's up! Your final score is ${score}.`,
            false,
            () => {
                navigate('profile');
            }
        );
    }
    
    function checkAchievements() {
        if (!currentUser) return;
        
        const username = currentUser.username;

        if (!achievements[username]) {
            achievements[username] = [];
        }
        
        const allUserScores = scores.filter(s => s.username === username);

        // First Win achievement
        if (allUserScores.length > 0 && allUserScores.some(s => s.score > 0) && !achievements[username].includes('First Win')) {
            achievements[username].push('First Win');
            showNotification('🏆 Achievement Unlocked: First Win!');
        }
        
        // High Score achievement
        if (allUserScores.some(s => s.score >= 200) && !achievements[username].includes('High Score')) {
            achievements[username].push('High Score');
            showNotification('🏆 Achievement Unlocked: High Score!');
        }

        // Sorting Master
        if (allUserScores.filter(s => s.game.includes('sorting') && s.score > 0).length >= 5 && !achievements[username].includes('Sorting Master')) {
            achievements[username].push('Sorting Master');
            showNotification('🏆 Achievement Unlocked: Sorting Master!');
        }

        // Stack Expert
        if (allUserScores.filter(s => s.game.includes('stack') && s.score > 0).length >= 5 && !achievements[username].includes('Stack Expert')) {
            achievements[username].push('Stack Expert');
            showNotification('🏆 Achievement Unlocked: Stack Expert!');
        }
        
        // Queue Pro
        if (allUserScores.filter(s => s.game.includes('queue') && s.score > 0).length >= 5 && !achievements[username].includes('Queue Pro')) {
            achievements[username].push('Queue Pro');
            showNotification('🏆 Achievement Unlocked: Queue Pro!');
        }

        // Graph Navigator
        if (allUserScores.filter(s => s.game.includes('graph') && s.score > 0).length >= 5 && !achievements[username].includes('Graph Navigator')) {
            achievements[username].push('Graph Navigator');
            showNotification('🏆 Achievement Unlocked: Graph Navigator!');
        }
        
        // Array Explorer
        if (allUserScores.filter(s => s.game.includes('array') && s.score > 0).length >= 1 && !achievements[username].includes('Array Explorer')) {
            achievements[username].push('Array Explorer');
            showNotification('🏆 Achievement Unlocked: Array Explorer!');
        }

        if (allUserScores.filter(s => s.game.includes('string') && s.score > 0).length >= 1 && !achievements[username].includes('String Reverser')) {
            achievements[username].push('String Reverser');
            showNotification('🏆 Achievement Unlocked: String Reverser!');
        }
        
        if (allUserScores.filter(s => s.game.includes('hash') && s.score > 0).length >= 1 && !achievements[username].includes('Hashing Hero')) {
            achievements[username].push('Hashing Hero');
            showNotification('🏆 Achievement Unlocked: Hashing Hero!');
        }
        
        // Tree Master
        if (allUserScores.filter(s => s.game.includes('tree') && s.score > 0).length >= 3 && !achievements[username].includes('Tree Master')) {
            achievements[username].push('Tree Master');
            showNotification('🏆 Achievement Unlocked: Tree Master!');
        }
        
        // DSA Enthusiast
        if (allUserScores.length >= 10 && !achievements[username].includes('DSA Enthusiast')) {
            achievements[username].push('DSA Enthusiast');
            showNotification('🏆 Achievement Unlocked: DSA Enthusiast!');
        }
        
        // Flawless Victory
        if (allUserScores.some(s => s.score > 0 && s.usedHint === false) && !achievements[username].includes('Flawless Victory')) {
            achievements[username].push('Flawless Victory');
            showNotification('🏆 Achievement Unlocked: Flawless Victory!');
        }
        
        // Data Collector
        if (feedback.filter(f => f.username === username).length >= 1 && !achievements[username].includes('Data Collector')) {
            achievements[username].push('Data Collector');
            showNotification('🏆 Achievement Unlocked: Data Collector!');
        }
        
        // Marathon Runner
        const totalTimePlayed = allUserScores.reduce((sum, s) => sum + s.time, 0);
        if (totalTimePlayed >= 3600 && !achievements[username].includes('Marathon Runner')) {
            achievements[username].push('Marathon Runner');
            showNotification('🏆 Achievement Unlocked: Marathon Runner!');
        }

        saveToLocalStorage();
    }
// Event Listeners
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        if (isPaused) {
            showNotification('Game Paused');
        } else {
            showNotification('Game Resumed');
        }
    });

    instructionsBtn.addEventListener('click', () => {
        let instructions = '';
        switch(gameName) {
            case 'sorting':
            case 'sorting-challenge':
                instructions = 'Click on two bars to swap their positions. Your goal is to sort the array from smallest to largest. You have 3 attempts per level.';
                break;
            case 'stack':
            case 'stack-stacker':
                instructions = 'Use the Push button to add elements to the top of the stack (LIFO - Last In, First Out). Use the Pop button to remove the top element. Complete tasks to earn points!';
                break;
            case 'queue':
            case 'queue-commander':
                instructions = 'Use the Enqueue button to add elements to the back of the queue (FIFO - First In, First Out). Use the Dequeue button to remove the front element. Complete tasks to earn points!';
                break;
            case 'graph':
            case 'maze-explorer':
                instructions = 'Find the shortest path from Start (S) to End (E) by clicking on adjacent cells. Use the Solve button for a hint. Avoid the walls (gray cells).';
                break;
            case 'bubble-sort':
            case 'quick-sort':
            case 'merge-sort':
            case 'heap-sort':
                instructions = 'This is a visualization game. Click start to watch the algorithm sort the array step-by-step. There is no user interaction.';
                break;
            default:
                instructions = 'Complete the challenges to earn points and advance to the next level!';
        }
        
        showModal('Game Instructions', instructions);
    });
    
    restartBtn.addEventListener('click', () => {
        showModal('Restart Game', 'Are you sure you want to restart the game?', true).then(result => {
            if (result) {
                score = 0;
                time = 0;
                level = 1;
                attempts = 3;
                isPaused = false;
                gameData = null;
                usedHint = false;
                updateHUD();
                pauseBtn.textContent = 'Pause';
                loadGameContent();
                startTimer();
            }
        });
    });
    
    nextLevelBtn.addEventListener('click', () => {
        level++;
        loadGameContent();
        showNotification(`Starting Level ${level}`);
    });
    
    hintBtn.addEventListener('click', () => {
        usedHint = true;
        showModal('Hint', 'Try thinking about the core principle of this data structure. For sorting, consider comparison-based algorithms. For stacks, remember LIFO. For queues, remember FIFO. For graphs, consider pathfinding algorithms like BFS or DFS.');
    });

    // Authentication check and game initialization
    checkAuthentication(() => {
        updateHUD();
        loadGameContent();
        startTimer();
    });
}

// 5. User Profile
function renderProfilePage() {
    checkAuthentication(() => {
        const user = currentUser;
        const userScores = scores.filter(s => s.username === user.username);
        const gameCounts = {};
        userScores.forEach(s => {
            gameCounts[s.game] = (gameCounts[s.game] || 0) + 1;
        });
        
        const totalGames = user.gamesPlayed || 0;
        const winCount = user.wins || 0;
        const winRatio = totalGames > 0 ? ((winCount / totalGames) * 100).toFixed(1) : 0;
        const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
        const avgScore = userScores.length > 0 ? (totalScore / userScores.length).toFixed(0) : 0;
        const unlockedAchievements = achievements[user.username] || [];

        fetch('profile.html')
            .then(response => response.text())
            .then(html => {
                // Register the Handlebars helper
                Handlebars.registerHelper('getAchievementDescription', getAchievementDescription);
                
                const template = Handlebars.compile(html);
                const data = {
                    user,
                    totalGames,
                    winRatio,
                    winCount,
                    avgScore,
                    recentActivity: userScores.slice(-5).reverse(),
                    unlockedAchievements,
                    gamePerformance: Object.keys(gameCounts).map(game => {
                        const gameScores = userScores.filter(s => s.game === game);
                        const gameTotal = gameScores.reduce((sum, s) => sum + s.score, 0);
                        const gameAvg = (gameTotal / gameScores.length).toFixed(0);
                        return {
                            game,
                            gameAvg,
                            gameCounts: gameScores.length,
                            progress: Math.min(100, gameAvg / 100 * 100)
                        };
                    })
                };
                content.innerHTML = template(data);
                document.getElementById('edit-profile-form').addEventListener('submit', handleProfileEdit);
            });
    });
}

function getAchievementDescription(achievement) {
    const descriptions = {
        'First Win': 'Win your first game challenge.',
        'High Score': 'Score 200+ points in a single game.',
        'Sorting Master': 'Complete 5 sorting challenges.',
        'Stack Expert': 'Master 5 stack challenges.',
        'Queue Pro': 'Complete 5 queue challenges.',
        'Graph Navigator': 'Solve 5 graph puzzles.',
        'Array Explorer': 'Complete 1 array challenge.',
        'String Reverser': 'Complete 1 string challenge.',
        'Hashing Hero': 'Complete 1 hash table challenge.'
    };
    return descriptions[achievement] || 'Complete challenges to earn this achievement.';
}

function handleProfileEdit(e) {
    e.preventDefault();
    const newUsername = document.getElementById('edit-username').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();
    const newAvatar = document.getElementById('edit-avatar').value.trim();
    
    const oldUsername = currentUser.username;

    // Validate inputs
    if (!newUsername) {
        return showModal('Update Failed', 'Username cannot be empty.');
    }
    
    if (!newEmail || !newEmail.includes('@')) {
        return showModal('Update Failed', 'Please enter a valid email address.');
    }
    
    if (!newAvatar) {
        return showModal('Update Failed', 'Please enter an avatar URL.');
    }
    
    // Check if username is taken (except by current user)
    const existingUser = users.find(u => u.username.toLowerCase() === newUsername.toLowerCase() && u.username !== oldUsername);
    if (existingUser) {
        return showModal('Update Failed', 'Username already exists.');
    }
    
    // Update in users array
    const userIndex = users.findIndex(u => u.username === oldUsername);
    if (userIndex !== -1) {
        // Update user data
        users[userIndex].username = newUsername;
        users[userIndex].email = newEmail;
        users[userIndex].avatar = newAvatar;
        
        // Update scores and achievements for the new username
        scores.forEach(score => {
            if (score.username === oldUsername) {
                score.username = newUsername;
            }
        });
        if (achievements[oldUsername]) {
            achievements[newUsername] = achievements[oldUsername];
            delete achievements[oldUsername];
        }
        
        // Update current user
        currentUser.username = newUsername;
        currentUser.email = newEmail;
        currentUser.avatar = newAvatar;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        saveToLocalStorage();
        
        // Update navigation
        updateAuthState();
        
        showNotification('Profile updated successfully!');
        navigate('profile');
    }
}

// 6. Leaderboard Page
function renderLeaderboardPage() {
    fetch('leaderboard.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            const sortedScores = [...scores].sort((a, b) => b.score - a.score);
            const games = [...new Set(scores.map(s => s.game))];
            
            document.getElementById('leaderboard-list').innerHTML = renderLeaderboardList(sortedScores, true);

            const filterBtns = document.querySelectorAll('.filter-btn');
            const searchInput = document.getElementById('leaderboard-search');
            const sortSelect = document.getElementById('leaderboard-sort');
            
            // Add event listeners
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    updateLeaderboard();
                });
            });
            
            searchInput.addEventListener('input', updateLeaderboard);
            sortSelect.addEventListener('change', updateLeaderboard);
            
            function updateLeaderboard() {
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                const searchTerm = searchInput.value.toLowerCase();
                const sortBy = sortSelect.value;
                
                let filteredScores = [...scores];
                
                // Apply game filter
                if (activeFilter !== 'all') {
                    filteredScores = filteredScores.filter(s => s.game === activeFilter);
                }
                
                // Apply search
                if (searchTerm) {
                    filteredScores = filteredScores.filter(s => 
                        s.username.toLowerCase().includes(searchTerm) || 
                        s.game.toLowerCase().includes(searchTerm)
                    );
                }
                
                // Apply sorting
                filteredScores.sort((a, b) => {
                    switch(sortBy) {
                        case 'date':
                            return new Date(b.date) - new Date(a.date);
                        case 'level':
                            return (b.level || 0) - (a.level || 0);
                        case 'score':
                        default:
                            return b.score - a.score;
                    }
                });
                
                document.getElementById('leaderboard-list').innerHTML = renderLeaderboardList(filteredScores, true);
            }
        });
}

function renderLeaderboardList(scores, showGame = false) {
    if (scores.length === 0) return '<p class="text-center text-gray-500 py-8">No scores recorded yet.</p>';
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-left table-auto">
                <thead>
                    <tr class="text-gray-400 border-b border-border-color">
                        <th class="p-3">#</th>
                        <th class="p-3">Player</th>
                        ${showGame ? '<th class="p-3">Game</th>' : ''}
                        <th class="p-3">Score</th>
                        <th class="p-3">Level</th>
                        <th class="p-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${scores.map((s, index) => `
                        <tr class="border-b border-border-color hover:bg-gray-700 hover:bg-opacity-30 transition-colors ${currentUser && s.username === currentUser.username ? 'bg-secondary-color bg-opacity-20 font-bold' : ''}">
                            <td class="p-3">${index + 1}</td>
                            <td class="p-3">${s.username}</td>
                            ${showGame ? `<td class="p-3">${s.game.replace(/-/g, ' ').toUpperCase()}</td>` : ''}
                            <td class="p-3 font-bold text-primary-color">${s.score}</td>
                            <td class="p-3">${s.level || 1}</td>
                            <td class="p-3 text-sm text-gray-400">${new Date(s.date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Achievements Page
function renderAchievementsPage() {
    checkAuthentication(() => {
        const userAchievements = achievements[currentUser.username] || [];
        const allAchievements = [
            {
                id: 'first-win',
                name: 'First Win',
                description: 'Win your first game challenge.',
                icon: '🎯',
                unlocked: userAchievements.includes('First Win'),
                game: 'all'
            },
            {
                id: 'high-score',
                name: 'High Score',
                description: 'Score 200+ points in a single game.',
                icon: '📈',
                unlocked: userAchievements.includes('High Score'),
                game: 'all'
            },
            {
                id: 'sorting-master',
                name: 'Sorting Master',
                description: 'Complete 5 sorting challenges.',
                icon: '🔢',
                unlocked: userAchievements.includes('Sorting Master'),
                progress: getProgress('sorting', 5),
                game: 'sorting-challenge'
            },
            {
                id: 'stack-expert',
                name: 'Stack Expert',
                description: 'Master 5 stack challenges.',
                icon: '🏗️',
                unlocked: userAchievements.includes('Stack Expert'),
                progress: getProgress('stack', 5),
                game: 'stack-stacker'
            },
            {
                id: 'queue-pro',
                name: 'Queue Pro',
                description: 'Complete 5 queue challenges.',
                icon: '🔄',
                unlocked: userAchievements.includes('Queue Pro'),
                progress: getProgress('queue', 5),
                game: 'queue-commander'
            },
            {
                id: 'graph-navigator',
                name: 'Graph Navigator',
                description: 'Solve 5 graph puzzles.',
                icon: '📊',
                unlocked: userAchievements.includes('Graph Navigator'),
                progress: getProgress('graph', 5),
                game: 'maze-explorer'
            },
            {
                id: 'array-explorer',
                name: 'Array Explorer',
                description: 'Complete 1 array challenge.',
                icon: '📋',
                unlocked: userAchievements.includes('Array Explorer'),
                progress: getProgress('array', 1),
                game: 'array-search'
            },
            {
                id: 'string-reverser',
                name: 'String Reverser',
                description: 'Complete 1 string challenge.',
                icon: '🔤',
                unlocked: userAchievements.includes('String Reverser'),
                progress: getProgress('string', 1),
                game: 'string-reversal'
            },
            {
                id: 'hashing-hero',
                name: 'Hashing Hero',
                description: 'Complete 1 hash table challenge.',
                icon: '🔑',
                unlocked: userAchievements.includes('Hashing Hero'),
                progress: getProgress('hash', 1),
                game: 'hash-table-hunt'
            },
            {
                id: 'tree-master',
                name: 'Tree Master',
                description: 'Complete 3 tree challenges.',
                icon: '🌳',
                unlocked: userAchievements.includes('Tree Master'),
                progress: getProgress('tree', 3),
                game: 'binary-tree-traversal'
            },
            {
                id: 'dsa-enthusiast',
                name: 'DSA Enthusiast',
                description: 'Play 10 games in total.',
                icon: '🎮',
                unlocked: userAchievements.includes('DSA Enthusiast'),
                progress: getProgress('total-games', 10),
                game: 'all'
            },
            {
                id: 'flawless-victory',
                name: 'Flawless Victory',
                description: 'Win a game without using a hint.',
                icon: '💯',
                unlocked: userAchievements.includes('Flawless Victory'),
                progress: null, // No progress bar for this one
                game: 'all'
            },
            {
                id: 'data-collector',
                name: 'Data Collector',
                description: 'Submit at least one piece of feedback.',
                icon: '📝',
                unlocked: userAchievements.includes('Data Collector'),
                progress: getProgress('data-collector', 1),
                game: 'feedback'
            },
            {
                id: 'marathon-runner',
                name: 'Marathon Runner',
                description: 'Play for a total of 1 hour (3600 seconds).',
                icon: '🏃',
                unlocked: userAchievements.includes('Marathon Runner'),
                progress: getProgress('marathon-runner', 3600),
                game: 'all'
            }
        ];

        fetch('achievements.html')
            .then(response => response.text())
            .then(html => {
                const template = Handlebars.compile(html);
                const unlockedCount = allAchievements.filter(a => a.unlocked).length;
                const data = {
                    allAchievements,
                    unlockedCount,
                    completionRate: Math.floor(unlockedCount / allAchievements.length * 100),
                    totalGames: getTotalGameCount()
                };
                content.innerHTML = template(data);

                document.querySelectorAll('.achievement-card').forEach(card => {
                    card.addEventListener('click', handleAchievementClick);
                });
            });
    });
}

function handleAchievementClick(e) {
    const card = e.currentTarget;
    const achievementId = card.dataset.id;
    const allAchievements = [
        {
            id: 'first-win',
            name: 'First Win',
            description: 'Win your first game challenge.',
            icon: '🎯',
            game: 'all'
        },
        {
            id: 'high-score',
            name: 'High Score',
            description: 'Score 200+ points in a single game.',
            icon: '📈',
            game: 'all'
        },
        {
            id: 'sorting-master',
            name: 'Sorting Master',
            description: 'Complete 5 sorting challenges.',
            icon: '🔢',
            game: 'sorting-challenge'
        },
        {
            id: 'stack-expert',
            name: 'Stack Expert',
            description: 'Master 5 stack challenges.',
            icon: '🏗️',
            game: 'stack-stacker'
        },
        {
            id: 'queue-pro',
            name: 'Queue Pro',
            description: 'Complete 5 queue challenges.',
            icon: '🔄',
            game: 'queue-commander'
        },
        {
            id: 'graph-navigator',
            name: 'Graph Navigator',
            description: 'Solve 5 graph puzzles.',
            icon: '📊',
            game: 'maze-explorer'
        },
        {
            id: 'array-explorer',
            name: 'Array Explorer',
            description: 'Complete 1 array challenge.',
            icon: '📋',
            game: 'array-search'
        },
        {
            id: 'string-reverser',
            name: 'String Reverser',
            description: 'Complete 1 string challenge.',
            icon: '🔤',
            game: 'string-reversal'
        },
        {
            id: 'hashing-hero',
            name: 'Hashing Hero',
            description: 'Complete 1 hash table challenge.',
            icon: '🔑',
            game: 'hash-table-hunt'
        },
         {
            id: 'tree-master',
            name: 'Tree Master',
            description: 'Complete 3 tree challenges.',
            icon: '🌳',
            game: 'binary-tree-traversal'
        },
        {
            id: 'dsa-enthusiast',
            name: 'DSA Enthusiast',
            description: 'Play 10 games in total.',
            icon: '🎮',
            game: 'all'
        },
        {
            id: 'flawless-victory',
            name: 'Flawless Victory',
            description: 'Win a game without using a hint.',
            icon: '💯',
            game: 'all'
        }
    ];

    const achievement = allAchievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const userAchievements = achievements[currentUser.username] || [];
    const isUnlocked = userAchievements.includes(achievement.name);
    const progress = getProgress(achievement.game, achievement.game === 'dsa-enthusiast' ? 10 : (achievement.id.includes('master') ? 3 : 1));

    let message = `
        <div class="text-center">
            <div class="text-6xl mb-4">${achievement.icon}</div>
            <p class="text-xl font-bold mb-2">${achievement.name}</p>
            <p class="text-gray-400 mb-4">${achievement.description}</p>
    `;

    if (isUnlocked) {
        message += `<p class="mt-4 text-green-400 font-bold">You've already unlocked this achievement!</p>`;
        showModal('Achievement Unlocked', message);
    } else {
        message += `<p class="text-lg font-medium mt-4">Progress: ${progress}%</p>`;
        message += `
            <div class="w-full mt-2">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
        
        if (achievement.game !== 'all') {
            message += `<button onclick="hideModal(); navigate('game?name=${achievement.game}')" class="btn-primary mt-6">Go to Game</button>`;
        }
        showModal('Achievement Locked', message);
    }
}

function getProgress(gameType, target) {
    if (!currentUser) return 0;
    
    const userScores = scores.filter(s => s.username === currentUser.username && s.score > 0);
    let count;

    if (gameType === 'total-games') {
        count = userScores.length;
    } else if (gameType === 'flawless-victory') {
        count = userScores.filter(s => s.usedHint === false).length;
        if (count > 0) return 100;
        return 0;
    } else {
        const baseGame = gameType.split('-')[0];
        count = userScores.filter(s => s.game.includes(baseGame)).length;
    }
    
    const progress = Math.min(100, (count / target) * 100);
    return Math.round(progress);
}

function getTotalGameCount() {
    if (!currentUser) return 0;
    return scores.filter(s => s.username === currentUser.username).length;
}

function checkAchievements() {
    if (!currentUser) return;
    
    const username = currentUser.username;

    if (!achievements[username]) {
        achievements[username] = [];
    }
    
    const allUserScores = scores.filter(s => s.username === username);

    // First Win achievement
    if (allUserScores.length > 0 && allUserScores.some(s => s.score > 0) && !achievements[username].includes('First Win')) {
        achievements[username].push('First Win');
        showNotification('🏆 Achievement Unlocked: First Win!');
    }
    
    // High Score achievement
    if (allUserScores.some(s => s.score >= 200) && !achievements[username].includes('High Score')) {
        achievements[username].push('High Score');
        showNotification('🏆 Achievement Unlocked: High Score!');
    }

    // Sorting Master
    if (allUserScores.filter(s => s.game.includes('sorting') && s.score > 0).length >= 5 && !achievements[username].includes('Sorting Master')) {
        achievements[username].push('Sorting Master');
        showNotification('🏆 Achievement Unlocked: Sorting Master!');
    }

    // Stack Expert
    if (allUserScores.filter(s => s.game.includes('stack') && s.score > 0).length >= 5 && !achievements[username].includes('Stack Expert')) {
        achievements[username].push('Stack Expert');
        showNotification('🏆 Achievement Unlocked: Stack Expert!');
    }
    
    // Queue Pro
    if (allUserScores.filter(s => s.game.includes('queue') && s.score > 0).length >= 5 && !achievements[username].includes('Queue Pro')) {
        achievements[username].push('Queue Pro');
        showNotification('🏆 Achievement Unlocked: Queue Pro!');
    }

    // Graph Navigator
    if (allUserScores.filter(s => s.game.includes('graph') && s.score > 0).length >= 5 && !achievements[username].includes('Graph Navigator')) {
        achievements[username].push('Graph Navigator');
        showNotification('🏆 Achievement Unlocked: Graph Navigator!');
    }
    
    // Array Explorer
    if (allUserScores.filter(s => s.game.includes('array') && s.score > 0).length >= 1 && !achievements[username].includes('Array Explorer')) {
        achievements[username].push('Array Explorer');
        showNotification('🏆 Achievement Unlocked: Array Explorer!');
    }

    if (allUserScores.filter(s => s.game.includes('string') && s.score > 0).length >= 1 && !achievements[username].includes('String Reverser')) {
        achievements[username].push('String Reverser');
        showNotification('🏆 Achievement Unlocked: String Reverser!');
    }
    
    if (allUserScores.filter(s => s.game.includes('hash') && s.score > 0).length >= 1 && !achievements[username].includes('Hashing Hero')) {
        achievements[username].push('Hashing Hero');
        showNotification('🏆 Achievement Unlocked: Hashing Hero!');
    }
    
    // Tree Master
    if (allUserScores.filter(s => s.game.includes('tree') && s.score > 0).length >= 3 && !achievements[username].includes('Tree Master')) {
        achievements[username].push('Tree Master');
        showNotification('🏆 Achievement Unlocked: Tree Master!');
    }
    
    // DSA Enthusiast
    if (allUserScores.length >= 10 && !achievements[username].includes('DSA Enthusiast')) {
        achievements[username].push('DSA Enthusiast');
        showNotification('🏆 Achievement Unlocked: DSA Enthusiast!');
    }
    
    // Flawless Victory
    if (allUserScores.some(s => s.score > 0 && s.usedHint === false) && !achievements[username].includes('Flawless Victory')) {
        achievements[username].push('Flawless Victory');
        showNotification('🏆 Achievement Unlocked: Flawless Victory!');
    }
    
    // Data Collector
    if (feedback.filter(f => f.username === username).length >= 1 && !achievements[username].includes('Data Collector')) {
        achievements[username].push('Data Collector');
        showNotification('🏆 Achievement Unlocked: Data Collector!');
    }
    
    // Marathon Runner
    const totalTimePlayed = allUserScores.reduce((sum, s) => sum + s.time, 0);
    if (totalTimePlayed >= 3600 && !achievements[username].includes('Marathon Runner')) {
        achievements[username].push('Marathon Runner');
        showNotification('🏆 Achievement Unlocked: Marathon Runner!');
    }

    saveToLocalStorage();
}
// 8. Practice Page
function renderPracticePage() {
    fetch('practice.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            initializePracticePage();
        });
}

function initializePracticePage() {
    // Sorting Visualizer
    const sortAlgorithm = document.getElementById('sort-algorithm');
    const arraySizeSlider = document.getElementById('array-size');
    const arraySizeValue = document.getElementById('array-size-value');
    const generateArrayBtn = document.getElementById('generate-array');
    const sortButton = document.getElementById('sort-button');
    const resetArrayBtn = document.getElementById('reset-array');
    const sortingVisualizer = document.getElementById('sorting-visualizer');
    const sortSteps = document.getElementById('sort-steps');
    const sortTime = document.getElementById('sort-time');
    
    // Data Structure Visualizer
    const dsStructure = document.getElementById('ds-structure');
    const dsVisualizer = document.getElementById('ds-visualizer');
    const stackControls = document.getElementById('stack-controls');
    const queueControls = document.getElementById('queue-controls');
    const treeControls = document.getElementById('tree-controls');
    const graphControls = document.getElementById('graph-controls');
    const hashTableControls = document.getElementById('hash-table-controls');
    
    // Stack controls
    const stackInput = document.getElementById('stack-input');
    const stackPush = document.getElementById('stack-push');
    const stackPop = document.getElementById('stack-pop');
    const stackClear = document.getElementById('stack-clear');
    
    // Queue controls
    const queueInput = document.getElementById('queue-input');
    const queueEnqueue = document.getElementById('queue-enqueue');
    const queueDequeue = document.getElementById('queue-dequeue');
    const queueClear = document.getElementById('queue-clear');
    
    // Tree controls
    const treeValue = document.getElementById('tree-value');
    const treeInsert = document.getElementById('tree-insert');
    const treeSearch = document.getElementById('tree-search');
    const treeClear = document.getElementById('tree-clear');
    
    // Graph controls
    const nodeValueInput = document.getElementById('graph-node-value');
    const addNodeBtn = document.getElementById('graph-add-node');
    const edgeFromInput = document.getElementById('graph-edge-from');
    const edgeToInput = document.getElementById('graph-edge-to');
    const addEdgeBtn = document.getElementById('graph-add-edge');
    const bfsBtn = document.getElementById('graph-bfs');
    const dfsBtn = document.getElementById('graph-dfs');
    const graphClearBtn = document.getElementById('graph-clear-btn');
    
    // Hash Table controls
    const hashKeyInput = document.getElementById('hash-key');
    const hashValueInput = document.getElementById('hash-value');
    const hashInsertBtn = document.getElementById('hash-insert');
    const hashSearchKeyInput = document.getElementById('hash-search-key');
    const hashSearchBtn = document.getElementById('hash-search');
    const hashClearBtn = document.getElementById('hash-clear');
    
    // State
    let array = [];
    let originalArray = [];
    let sorting = false;
    let stack = [];
    let queue = [];
    let tree = null;
    let graph = { nodes: new Map(), edges: new Map() };
    let hashTable = new Array(10).fill(null);
    
    // Initialize with default array
    generateNewArray();
    
    // Event Listeners
    arraySizeSlider.addEventListener('input', function() {
        arraySizeValue.textContent = this.value;
        generateNewArray();
    });
    
    generateArrayBtn.addEventListener('click', generateNewArray);
    resetArrayBtn.addEventListener('click', resetArray);
    sortButton.addEventListener('click', visualizeSort);
    
    dsStructure.addEventListener('change', function() {
        // Hide all controls first
        stackControls.classList.add('hidden');
        queueControls.classList.add('hidden');
        treeControls.classList.add('hidden');
        graphControls.classList.add('hidden');
        hashTableControls.classList.add('hidden');
        
        dsVisualizer.innerHTML = '';
        
        switch(this.value) {
            case 'stack':
                stackControls.classList.remove('hidden');
                renderStack();
                break;
            case 'queue':
                queueControls.classList.remove('hidden');
                renderQueue();
                break;
            case 'binary-tree':
                treeControls.classList.remove('hidden');
                renderTree();
                break;
            case 'graph':
                graphControls.classList.remove('hidden');
                renderGraph();
                break;
            case 'hash-table':
                hashTableControls.classList.remove('hidden');
                renderHashTable();
                break;
        }
    });
    
    // Stack events
    stackPush.addEventListener('click', function() {
        const value = stackInput.value.trim();
        if (value) {
            stack.push(value);
            renderStack();
            stackInput.value = '';
        }
    });
    
    stackPop.addEventListener('click', function() {
        if (stack.length > 0) {
            const value = stack.pop();
            renderStack();
            showNotification(`Popped: ${value}`);
        } else {
            showNotification('Stack is empty!');
        }
    });
    
    stackClear.addEventListener('click', function() {
        stack = [];
        renderStack();
        showNotification('Stack cleared');
    });
    
    // Queue events
    queueEnqueue.addEventListener('click', function() {
        const value = queueInput.value.trim();
        if (value) {
            queue.push(value);
            renderQueue();
            queueInput.value = '';
        }
    });
    
    queueDequeue.addEventListener('click', function() {
        if (queue.length > 0) {
            const value = queue.shift();
            renderQueue();
            showNotification(`Dequeued: ${value}`);
        } else {
            showNotification('Queue is empty!');
        }
    });
    
    queueClear.addEventListener('click', function() {
        queue = [];
        renderQueue();
        showNotification('Queue cleared');
    });
    
    // Tree events
    treeInsert.addEventListener('click', function() {
        const value = parseInt(treeValue.value);
        if (!isNaN(value)) {
            tree = insertIntoTree(tree, value);
            renderTree();
            treeValue.value = '';
        } else {
            showNotification('Please enter a valid number');
        }
    });
    
    treeSearch.addEventListener('click', function() {
        const value = parseInt(treeValue.value);
        if (!isNaN(value)) {
            const found = searchTree(tree, value);
            showNotification(found ? `Found ${value} in the tree!` : `${value} not found in the tree`);
        } else {
            showNotification('Please enter a valid number');
        }
    });
    
    treeClear.addEventListener('click', function() {
        tree = null;
        renderTree();
        showNotification('Tree cleared');
    });

    // Graph events
    addNodeBtn.addEventListener('click', () => {
        const value = nodeValueInput.value.trim();
        if (value && !graph.nodes.has(value)) {
            graph.nodes.set(value, new Set());
            graph.edges.set(value, new Set());
            renderGraph();
            nodeValueInput.value = '';
            showNotification(`Node '${value}' added.`);
        } else {
            showNotification('Invalid or existing node value.');
        }
    });

    addEdgeBtn.addEventListener('click', () => {
        const from = edgeFromInput.value.trim();
        const to = edgeToInput.value.trim();
        if (graph.nodes.has(from) && graph.nodes.has(to) && from !== to) {
            graph.edges.get(from).add(to);
            renderGraph();
            edgeFromInput.value = '';
            edgeToInput.value = '';
            showNotification(`Edge added from ${from} to ${to}.`);
        } else {
            showNotification('Invalid nodes for edge creation.');
        }
    });

    bfsBtn.addEventListener('click', async () => {
        if (graph.nodes.size === 0) {
            return showNotification('Graph is empty. Add nodes first.');
        }
        const startNode = nodeValueInput.value.trim() || graph.nodes.keys().next().value;
        if (!graph.nodes.has(startNode)) {
            return showNotification(`Start node '${startNode}' does not exist.`);
        }
        resetVisuals();
        await visualizeBFS(startNode);
    });

    dfsBtn.addEventListener('click', async () => {
        if (graph.nodes.size === 0) {
            return showNotification('Graph is empty. Add nodes first.');
        }
        const startNode = nodeValueInput.value.trim() || graph.nodes.keys().next().value;
        if (!graph.nodes.has(startNode)) {
            return showNotification(`Start node '${startNode}' does not exist.`);
        }
        resetVisuals();
        await visualizeDFS(startNode);
    });

    graphClearBtn.addEventListener('click', () => {
        graph = { nodes: new Map(), edges: new Map() };
        renderGraph();
        showNotification('Graph cleared.');
    });

    // Hash Table events
    hashInsertBtn.addEventListener('click', () => {
        const key = hashKeyInput.value.trim();
        const value = hashValueInput.value.trim();
        if (key && value) {
            insertIntoHashTable(key, value);
            renderHashTable();
            hashKeyInput.value = '';
            hashValueInput.value = '';
        } else {
            showNotification('Please enter a key and value.');
        }
    });

    hashSearchBtn.addEventListener('click', () => {
        const key = hashSearchKeyInput.value.trim();
        if (key) {
            searchHashTable(key);
        } else {
            showNotification('Please enter a key to search.');
        }
    });

    hashClearBtn.addEventListener('click', () => {
        hashTable = new Array(10).fill(null);
        renderHashTable();
        showNotification('Hash table cleared.');
    });

    // Helper functions
    function generateNewArray() {
        const size = parseInt(arraySizeSlider.value);
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
        originalArray = [...array];
        renderArray();
        sortSteps.textContent = 'Steps: 0';
        sortTime.textContent = 'Time: 0ms';
    }
    
    function resetArray() {
        array = [...originalArray];
        renderArray();
        sortSteps.textContent = 'Steps: 0';
        sortTime.textContent = 'Time: 0ms';
    }
    
    function renderArray() {
        sortingVisualizer.innerHTML = '';
        const max = Math.max(...array);
        
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'bg-primary-color rounded-t transition-all duration-100';
            bar.style.height = `${(value / max) * 200}px`;
            bar.style.width = `${Math.max(10, 100 / array.length)}px`;
            bar.title = value;
            sortingVisualizer.appendChild(bar);
        });
    }
    
    async function visualizeSort() {
        if (sorting) return;
        sorting = true;
        sortButton.disabled = true;
        sortButton.textContent = 'Sorting...';
        
        const startTime = performance.now();
        let steps = 0;
        
        const updateSteps = () => {
            steps++;
            sortSteps.textContent = `Steps: ${steps}`;
        };

        const updateTime = () => {
            const endTime = performance.now();
            sortTime.textContent = `Time: ${Math.round(endTime - startTime)}ms`;
        };
        
        const bars = sortingVisualizer.children;

        switch(sortAlgorithm.value) {
            case 'bubble':
                await bubbleSort(bars, updateSteps);
                break;
            case 'selection':
                await selectionSort(bars, updateSteps);
                break;
            case 'insertion':
                await insertionSort(bars, updateSteps);
                break;
            case 'merge':
                await mergeSortWrapper(bars, updateSteps);
                break;
            case 'quick':
                await quickSortWrapper(bars, updateSteps);
                break;
        }
        
        updateTime();
        sorting = false;
        sortButton.disabled = false;
        sortButton.textContent = 'Visualize Sort';
    }
    
    async function bubbleSort(bars, updateSteps) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                bars[j].style.backgroundColor = '#fbbf24';
                bars[j+1].style.backgroundColor = '#fbbf24';
                await sleep(50);
                
                if (array[j] > array[j+1]) {
                    [array[j], array[j+1]] = [array[j+1], array[j]];
                    renderArray();
                    updateSteps();
                }
                
                bars[j].style.backgroundColor = 'var(--primary-color)';
                bars[j+1].style.backgroundColor = 'var(--primary-color)';
                await sleep(50);
            }
        }
    }
    
    async function selectionSort(bars, updateSteps) {
        for (let i = 0; i < array.length; i++) {
            let minIdx = i;
            bars[i].style.backgroundColor = '#ef4444'; 
            await sleep(50);
            
            for (let j = i + 1; j < array.length; j++) {
                bars[j].style.backgroundColor = '#fbbf24';
                await sleep(50);
                if (array[j] < array[minIdx]) {
                    bars[minIdx].style.backgroundColor = 'var(--primary-color)';
                    minIdx = j;
                    bars[minIdx].style.backgroundColor = '#ef4444';
                }
                if (j !== minIdx) {
                    bars[j].style.backgroundColor = 'var(--primary-color)';
                }
            }
            
            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                renderArray();
                updateSteps();
            }
            
            bars[i].style.backgroundColor = '#10b981';
            bars[minIdx].style.backgroundColor = '#10b981'; 
            await sleep(100);
            for (let k = 0; k < array.length; k++) {
                bars[k].style.backgroundColor = 'var(--primary-color)';
            }
        }
    }
    
    async function insertionSort(bars, updateSteps) {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            bars[i].style.backgroundColor = '#fbbf24';
            await sleep(100);
            
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j = j - 1;
                renderArray();
                updateSteps();
                await sleep(50);
            }
            array[j + 1] = key;
            renderArray();
            await sleep(100);
        }
    }
    
    async function mergeSortWrapper(bars, updateSteps) {
        await mergeSort(0, array.length - 1, updateSteps);
    }
    
    async function mergeSort(low, high, updateSteps) {
        if (low < high) {
            const mid = Math.floor((low + high) / 2);
            await mergeSort(low, mid, updateSteps);
            await mergeSort(mid + 1, high, updateSteps);
            await merge(low, mid, high, updateSteps);
        }
    }
    
    async function merge(low, mid, high, updateSteps) {
        const left = array.slice(low, mid + 1);
        const right = array.slice(mid + 1, high + 1);
        
        let i = 0, j = 0, k = low;
        
        const bars = sortingVisualizer.children;
        for (let idx = low; idx <= high; idx++) {
            bars[idx].style.backgroundColor = '#fbbf24';
        }
        await sleep(100);
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                array[k] = left[i];
                i++;
            } else {
                array[k] = right[j];
                j++;
            }
            k++;
            updateSteps();
            renderArray();
            await sleep(50);
        }
        
        while (i < left.length) {
            array[k] = left[i];
            i++;
            k++;
            updateSteps();
            renderArray();
            await sleep(50);
        }
        
        while (j < right.length) {
            array[k] = right[j];
            j++;
            k++;
            updateSteps();
            renderArray();
            await sleep(50);
        }
        
        for (let idx = low; idx <= high; idx++) {
            bars[idx].style.backgroundColor = 'var(--primary-color)';
        }
    }
    
    async function quickSortWrapper(bars, updateSteps) {
        await quickSort(0, array.length - 1, updateSteps);
    }
    
    async function quickSort(low, high, updateSteps) {
        if (low < high) {
            const pi = await partition(low, high, updateSteps);
            await quickSort(low, pi - 1, updateSteps);
            await quickSort(pi + 1, high, updateSteps);
        }
    }
    
    async function partition(low, high, updateSteps) {
        const pivot = array[high];
        const bars = sortingVisualizer.children;
        bars[high].style.backgroundColor = '#ef4444';
        let i = low - 1;
        
        await sleep(100);
        
        for (let j = low; j < high; j++) {
            bars[j].style.backgroundColor = '#fbbf24';
            await sleep(50);
            
            if (array[j] <= pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                renderArray();
                updateSteps();
            }
            
            bars[j].style.backgroundColor = 'var(--primary-color)';
            await sleep(50);
        }
        
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        renderArray();
        updateSteps();
        
        bars[high].style.backgroundColor = 'var(--primary-color)';
        return i + 1;
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function renderStack() {
        dsVisualizer.innerHTML = '';
        
        if (stack.length === 0) {
            dsVisualizer.innerHTML = '<p class="text-gray-500">Stack is empty</p>';
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'flex flex-col-reverse items-center w-full';
        
        stack.forEach((item) => {
            const element = document.createElement('div');
            element.className = 'w-32 p-3 bg-secondary-color text-center rounded-lg mb-2 text-white font-medium animate-pop';
            element.textContent = item;
            container.appendChild(element);
        });
        
        dsVisualizer.appendChild(container);
    }
    
    function renderQueue() {
        dsVisualizer.innerHTML = '';
        
        if (queue.length === 0) {
            dsVisualizer.innerHTML = '<p class="text-gray-500">Queue is empty</p>';
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'flex items-center w-full overflow-x-auto';
        
        queue.forEach((item) => {
            const element = document.createElement('div');
            element.className = 'w-32 p-3 bg-secondary-color text-center rounded-lg mx-2 text-white font-medium flex-shrink-0 animate-pop';
            element.textContent = item;
            container.appendChild(element);
        });
        
        dsVisualizer.appendChild(container);
    }
    
    function renderTree() {
        dsVisualizer.innerHTML = '';
        
        if (!tree) {
            dsVisualizer.innerHTML = '<p class="text-gray-500">Tree is empty</p>';
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'w-full h-full flex items-center justify-center';
        
        const treeDiv = document.createElement('div');
        treeDiv.className = 'flex flex-col items-center justify-center relative w-full h-full';
        treeDiv.style.position = 'relative';
        
        const nodes = new Map();
        const nodePositions = new Map();

        function createNode(value, parent = null, isLeft = null) {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node absolute w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-bold text-sm z-10';
            nodeEl.textContent = value;
            nodes.set(value, nodeEl);
            dsVisualizer.appendChild(nodeEl);
            return nodeEl;
        }

        function calculatePositions(node, x, y, level, dx) {
            if (!node) return;
            nodePositions.set(node.value, { x, y });
            
            const newDx = dx / 2;
            if (node.left) {
                calculatePositions(node.left, x - newDx, y + 60, level + 1, newDx);
            }
            if (node.right) {
                calculatePositions(node.right, x + newDx, y + 60, level + 1, newDx);
            }
        }

        function renderLines(node) {
            if (!node) return;
            const { x, y } = nodePositions.get(node.value);

            if (node.left) {
                const { x: childX, y: childY } = nodePositions.get(node.left.value);
                drawLine(x, y, childX, childY);
                renderLines(node.left);
            }
            if (node.right) {
                const { x: childX, y: childY } = nodePositions.get(node.right.value);
                drawLine(x, y, childX, childY);
                renderLines(node.right);
            }
        }

        function drawLine(x1, y1, x2, y2) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            line.style.position = 'absolute';
            line.style.top = '0';
            line.style.left = '0';
            line.style.width = '100%';
            line.style.height = '100%';
            line.style.overflow = 'visible';
            line.style.zIndex = '0';
            
            const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svgLine.setAttribute('x1', x1);
            svgLine.setAttribute('y1', y1);
            svgLine.setAttribute('x2', x2);
            svgLine.setAttribute('y2', y2);
            svgLine.setAttribute('stroke', 'var(--border-color)');
            svgLine.setAttribute('stroke-width', '2');
            
            line.appendChild(svgLine);
            dsVisualizer.appendChild(line);
        }

        calculatePositions(tree, dsVisualizer.clientWidth / 2, 30, 0, dsVisualizer.clientWidth / 4);
        
        dsVisualizer.innerHTML = '';
        
        dsVisualizer.style.position = 'relative';
        dsVisualizer.style.overflow = 'hidden';

        renderLines(tree);
        
        function placeNodes(node) {
            if (!node) return;
            const { x, y } = nodePositions.get(node.value);
            const nodeEl = createNode(node.value);
            nodeEl.style.left = `${x}px`;
            nodeEl.style.top = `${y}px`;
            placeNodes(node.left);
            placeNodes(node.right);
        }
        placeNodes(tree);

        dsVisualizer.innerHTML += `
            <style>
                .node { animation: pop 0.3s ease; }
            </style>
        `;
    }
    
    function insertIntoTree(root, value) {
        if (!root) {
            return { value: value, left: null, right: null };
        }
        
        if (value < root.value) {
            root.left = insertIntoTree(root.left, value);
        } else {
            root.right = insertIntoTree(root.right, value);
        }
        
        return root;
    }
    
    function searchTree(root, value) {
        if (!root) return false;
        if (root.value === value) return true;
        if (value < root.value) return searchTree(root.left, value);
        return searchTree(root.right, value);
    }

    // Graph Visualizer functions
    function renderGraph() {
        dsVisualizer.innerHTML = '';
        const nodes = graph.nodes;
        const edges = graph.edges;

        if (nodes.size === 0) {
            dsVisualizer.innerHTML = '<p class="text-gray-500">Graph is empty. Add a node to begin.</p>';
            return;
        }

        const positions = new Map();
        let i = 0;
        nodes.forEach( (adj, node) => {
            const x = 50 + (i % 3) * 150;
            const y = 50 + Math.floor(i / 3) * 100;
            positions.set(node, { x, y });
            i++;
        });

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        dsVisualizer.appendChild(svg);

        edges.forEach((destinations, startNode) => {
            const startPos = positions.get(startNode);
            if (!startPos) return;
            destinations.forEach(endNode => {
                const endPos = positions.get(endNode);
                if (!endPos) return;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startPos.x + 24);
                line.setAttribute('y1', startPos.y + 24);
                line.setAttribute('x2', endPos.x + 24);
                line.setAttribute('y2', endPos.y + 24);
                line.setAttribute('stroke', '#ccc');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            });
        });

        nodes.forEach((adj, node) => {
            const pos = positions.get(node);
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node absolute w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-bold text-sm animate-pop';
            nodeEl.textContent = node;
            nodeEl.dataset.node = node;
            nodeEl.style.left = `${pos.x}px`;
            nodeEl.style.top = `${pos.y}px`;
            dsVisualizer.appendChild(nodeEl);
        });
        
    }

    async function visualizeBFS(startNode) {
        const visited = new Set();
        const queue = [startNode];
        visited.add(startNode);
        
        const path = [];
        const nodes = dsVisualizer.querySelectorAll('.node');

        while (queue.length > 0) {
            const node = queue.shift();
            path.push(node);
            
            const nodeEl = Array.from(nodes).find(el => el.dataset.node === node);
            if (nodeEl) {
                nodeEl.classList.add('bg-green-500');
                await sleep(500);
            }

            const neighbors = Array.from(graph.edges.get(node) || []);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    const neighborEl = Array.from(nodes).find(el => el.dataset.node === neighbor);
                    if (neighborEl) {
                        neighborEl.classList.add('bg-yellow-500');
                    }
                }
            }
        }
        showNotification(`BFS Traversal: ${path.join(' -> ')}`);
        resetVisuals();
    }

    async function visualizeDFS(startNode) {
        const visited = new Set();
        const stack = [startNode];
        
        const path = [];
        const nodes = dsVisualizer.querySelectorAll('.node');

        while (stack.length > 0) {
            const node = stack.pop();
            if (!visited.has(node)) {
                visited.add(node);
                path.push(node);
                
                const nodeEl = Array.from(nodes).find(el => el.dataset.node === node);
                if (nodeEl) {
                    nodeEl.classList.add('bg-green-500');
                    await sleep(500);
                }

                const neighbors = Array.from(graph.edges.get(node) || []);
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    if (!visited.has(neighbors[i])) {
                        stack.push(neighbors[i]);
                        const neighborEl = Array.from(nodes).find(el => el.dataset.node === neighbors[i]);
                        if (neighborEl) {
                            neighborEl.classList.add('bg-yellow-500');
                        }
                    }
                }
            }
        }
        showNotification(`DFS Traversal: ${path.join(' -> ')}`);
        resetVisuals();
    }

    function resetVisuals() {
        const nodes = dsVisualizer.querySelectorAll('.node');
        nodes.forEach(node => {
            node.classList.remove('bg-green-500', 'bg-yellow-500');
        });
    }

    // Hash Table Visualizer functions
    function hashFunction(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % hashTable.length;
    }

    function insertIntoHashTable(key, value) {
        let index = hashFunction(key);
        let originalIndex = index;
        let steps = 0;

        while(hashTable[index] !== null) {
            index = (index + 1) % hashTable.length;
            steps++;
            if (index === originalIndex) {
                showNotification('Hash table is full!');
                return;
            }
        }
        hashTable[index] = { key, value, steps };
        showNotification(`Inserted '${key}' at index ${index} after ${steps} collision(s).`);
    }

    function searchHashTable(key) {
        let index = hashFunction(key);
        let originalIndex = index;
        let steps = 0;
        let found = false;

        while(hashTable[index] !== null) {
            if (hashTable[index].key === key) {
                showNotification(`Found '${key}' at index ${index} after ${steps} probe(s). Value: ${hashTable[index].value}`);
                found = true;
                break;
            }
            index = (index + 1) % hashTable.length;
            steps++;
            if (index === originalIndex) {
                break;
            }
        }
        if (!found) {
            showNotification(`Key '${key}' not found.`);
        }
    }

    function renderHashTable() {
        dsVisualizer.innerHTML = '';
        dsVisualizer.classList.remove('flex', 'flex-col', 'flex-col-reverse');
        dsVisualizer.classList.add('grid', 'grid-cols-5', 'gap-2');
        dsVisualizer.style.display = 'grid';

        hashTable.forEach((item, index) => {
            const bucket = document.createElement('div');
            bucket.className = 'w-full h-16 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-1 relative overflow-hidden';
            bucket.innerHTML = `<span class="text-sm text-gray-400 absolute top-1 left-1">#${index}</span>`;
            if (item) {
                bucket.innerHTML += `<p class="font-bold text-sm text-primary-color">${item.key}</p><p class="text-xs text-gray-300">${item.value}</p>`;
            } else {
                bucket.innerHTML += `<p class="text-gray-500">Empty</p>`;
            }
            dsVisualizer.appendChild(bucket);
        });
    }
}

// 9. Topics Page
function renderTopicsPage() {
    const topics = [
        { 
            name: 'Arrays', 
            description: 'A collection of elements stored at contiguous memory locations.',
            games: ['Sorting Challenge', 'Array Search', 'Matrix Operations'],
            icon: '📋'
        },
        { 
            name: 'Strings', 
            description: 'A sequence of characters used to represent text.',
            games: ['String Reversal', 'Palindrome Checker', 'Anagram Solver'],
            icon: '🔤'
        },
        { 
            name: 'Stacks', 
            description: 'A LIFO (Last In, First Out) data structure.',
            games: ['Stack Stacker', 'Balanced Parentheses', 'Tower of Hanoi'],
            icon: '🏗️'
        },
        { 
            name: 'Queues', 
            description: 'A FIFO (First In, First Out) data structure.',
            games: ['Queue Commander', 'Print Queue', 'Breadth-First Search'],
            icon: '🔄'
        },
        { 
            name: 'Trees', 
            description: 'A hierarchical data structure with a root value and subtrees.',
            games: ['Binary Tree Traversal', 'BST Operations', 'Heap Builder'],
            icon: '🌳'
        },
        { 
            name: 'Graphs', 
            description: 'A collection of nodes connected by edges.',
            games: ['Maze Explorer', 'Shortest Path', 'Network Flow'],
            icon: '📊'
        },
        { 
            name: 'Hash Tables', 
            description: 'A data structure that implements an associative array.',
            games: ['Hash Table Hunt', 'Collision Resolver', 'Dictionary Builder'],
            icon: '🔑'
        },
        { 
            name: 'Sorting', 
            description: 'Algorithms for arranging data in a particular order.',
            games: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'],
            icon: '🔢'
        }
    ];

    fetch('topics.html')
        .then(response => response.text())
        .then(html => {
            const template = Handlebars.compile(html);
            const data = { topics };
            content.innerHTML = template(data);
        });
}

// 10. About Page
function renderAboutPage() {
    fetch('about.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
        });
}

// 11. Settings Page
function renderSettingsPage() {
    fetch('settings.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            // Event Listeners
            document.getElementById('dark-theme-btn').addEventListener('click', () => {
                settings.theme = 'dark';
                applyTheme();
                saveToLocalStorage();
                showNotification('Theme updated!');
            });
            
            document.getElementById('light-theme-btn').addEventListener('click', () => {
                settings.theme = 'light';
                applyTheme();
                saveToLocalStorage();
                showNotification('Theme updated!');
            });
            
            document.getElementById('difficulty-select').addEventListener('change', (e) => {
                settings.difficulty = e.target.value;
                saveToLocalStorage();
                showNotification(`Difficulty set to ${settings.difficulty}.`);
            });
            
            document.getElementById('sound-toggle').addEventListener('change', (e) => {
                settings.sound = e.target.checked;
                saveToLocalStorage();
                showNotification(settings.sound ? 'Sound enabled' : 'Sound disabled');
            });
            
            document.getElementById('export-data-btn').addEventListener('click', exportUserData);
            document.getElementById('reset-progress-btn').addEventListener('click', resetProgress);
            
            // Initial state update
            applyTheme();
        });
}

function applyTheme() {
    document.body.className = `${settings.theme}-theme`;
    // Update button states
    const darkBtn = document.getElementById('dark-theme-btn');
    const lightBtn = document.getElementById('light-theme-btn');
    if (darkBtn && lightBtn) {
        if (settings.theme === 'dark') {
            darkBtn.classList.add('btn-primary');
            darkBtn.classList.remove('border-gray-400');
            lightBtn.classList.remove('btn-primary');
            lightBtn.classList.add('border-gray-400');
        } else {
            lightBtn.classList.add('btn-primary');
            lightBtn.classList.remove('border-gray-400');
            darkBtn.classList.remove('btn-primary');
            darkBtn.classList.add('border-gray-400');
        }
    }
}

function exportUserData() {
    if (!currentUser) {
        showModal('Export Failed', 'You must be logged in to export data.');
        return;
    }
    
    const userData = {
        user: currentUser,
        scores: scores.filter(s => s.username === currentUser.username),
        achievements: achievements[currentUser.username] || [],
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `dsa-game-hub-data-${currentUser.username}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showNotification('Data exported successfully!');
}

function resetProgress() {
    showModal('Are you sure?', 'This will permanently delete all your scores, achievements, and profile data. This action cannot be undone.', true).then(result => {
        if (result) {
            // Remove user-specific data
            scores = scores.filter(s => s.username !== currentUser.username);
            if (achievements[currentUser.username]) {
                delete achievements[currentUser.username];
            }
            
            // Update user stats
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].gamesPlayed = 0;
                users[userIndex].wins = 0;
            }
            
            saveToLocalStorage();
            showNotification('All progress has been reset.');
            navigate('home');
        }
    });
}

// 12. Contact Page
function renderContactPage() {
    fetch('contact.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            document.getElementById('contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('contact-name').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                const subject = document.getElementById('contact-subject').value.trim();
                const message = document.getElementById('contact-message').value.trim();

                if (!name || !email || !subject || !message) {
                    showModal('Submission Failed', 'Please fill in all fields.');
                    return;
                }

                if (!email.includes('@')) {
                    showModal('Submission Failed', 'Please enter a valid email address.');
                    return;
                }

                const newFeedback = { 
                    name, 
                    email, 
                    subject, 
                    message, 
                    date: new Date().toISOString(),
                    status: 'unread'
                };
                
                feedback.push(newFeedback);
                saveToLocalStorage();
                showNotification('Thank you for your feedback!');
                
                // Reset form
                document.getElementById('contact-form').reset();
            });
        });
}

// 13. Feedback Page
function renderFeedbackPage() {
    fetch('feedback.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
            const games = [...new Set(scores.map(s => s.game))];
            const gameSelect = document.getElementById('game-select');
            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game;
                option.textContent = game.toUpperCase();
                gameSelect.appendChild(option);
            });

            const ratingStars = document.getElementById('rating-stars');
            const feedbackMessage = document.getElementById('feedback-message');
            const submitFeedbackBtn = document.getElementById('submit-feedback');
            
            let selectedRating = 0;
            
            // Rating stars interaction
            ratingStars.addEventListener('mouseover', (e) => {
                if (e.target.tagName === 'SPAN') {
                    const value = parseInt(e.target.dataset.value);
                    highlightStars(value);
                }
            });
            
            ratingStars.addEventListener('mouseout', () => {
                highlightStars(selectedRating);
            });
            
            ratingStars.addEventListener('click', (e) => {
                if (e.target.tagName === 'SPAN') {
                    selectedRating = parseInt(e.target.dataset.value);
                    highlightStars(selectedRating);
                }
            });
            
            function highlightStars(count) {
                const stars = ratingStars.querySelectorAll('span');
                stars.forEach((star, index) => {
                    if (index < count) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            }
            
            submitFeedbackBtn.addEventListener('click', () => {
                const selectedGame = gameSelect.value;
                
                if (!selectedGame) {
                    showModal('Submission Failed', 'Please select a game.');
                    return;
                }
                
                if (selectedRating === 0) {
                    showModal('Submission Failed', 'Please give a rating.');
                    return;
                }
                
                const message = feedbackMessage.value.trim();
                
                if (!gameRatings[selectedGame]) {
                    gameRatings[selectedGame] = [];
                }
                
                gameRatings[selectedGame].push({ 
                    rating: selectedRating, 
                    message: message,
                    username: currentUser ? currentUser.username : 'anonymous',
                    date: new Date().toISOString()
                });
                
                saveToLocalStorage();
                showNotification('Thank you for your feedback!');
                
                // Reset form
                gameSelect.value = '';
                highlightStars(0);
                selectedRating = 0;
                feedbackMessage.value = '';
                
                // Refresh ratings display
                refreshRatings();
            });
            
            function refreshRatings() {
                const ratingsContainer = document.getElementById('ratings-container');
                const games = [...new Set(scores.map(s => s.game))];
                
                ratingsContainer.innerHTML = games.map(game => {
                    const ratings = gameRatings[game] || [];
                    const avg = ratings.length > 0 ? 
                        (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 
                        '0.0';
                    
                    return `
                        <div class="p-4 rounded-lg bg-gray-700 bg-opacity-30">
                            <div class="flex justify-between mb-2">
                                <p class="font-medium">${game.toUpperCase()}</p>
                                <p class="font-bold text-yellow-400">${avg} ⭐</p>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${avg * 20}%"></div>
                            </div>
                            <p class="text-sm text-gray-400 mt-1">${ratings.length} rating${ratings.length === 1 ? '' : 's'}</p>
                        </div>
                    `;
                }).join('');
            }
            refreshRatings(); // Initial call
        });
}

// 14. Admin Panel
function renderAdminPage() {
    checkAuthentication(() => {
        if (!currentUser || !currentUser.isAdmin) {
            showModal('Access Denied', 'You do not have permission to view this page.').then(() => {
                navigate('home');
            });
            return;
        }
        
        fetch('admin.html')
            .then(response => response.text())
            .then(html => {
                const template = Handlebars.compile(html);
                const data = {
                    totalUsers: users.length,
                    totalScores: scores.length,
                    totalFeedback: feedback.length,
                    ratedGames: Object.keys(gameRatings).length,
                    users,
                    recentFeedback: feedback.slice(-5).reverse(),
                    hasFeedback: feedback.length > 0
                };
                content.innerHTML = template(data);

                // Add event listeners for admin actions
                document.getElementById('backup-data').addEventListener('click', backupData);
                document.getElementById('clear-feedback').addEventListener('click', clearFeedback);
                document.getElementById('reset-all-progress').addEventListener('click', resetAllProgress);
            });
    });
}

function backupData() {
    const backup = {
        users: users,
        scores: scores,
        achievements: achievements,
        feedback: feedback,
        gameRatings: gameRatings,
        settings: settings,
        backupDate: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `dsa-game-hub-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showNotification('Backup created successfully!');
}

function clearFeedback() {
    showModal('Confirm Action', 'Are you sure you want to clear all feedback? This cannot be undone.', true).then(result => {
        if (result) {
            feedback = [];
            saveToLocalStorage();
            showNotification('All feedback cleared.');
            navigate('admin');
        }
    });
}

function resetAllProgress() {
    showModal('Danger!', 'Are you sure you want to reset ALL user progress? This will delete all scores and achievements for all users. This action cannot be undone.', true).then(result => {
        if (result) {
            scores = [];
            achievements = {};
            users.forEach(u => {
                u.gamesPlayed = 0;
                u.wins = 0;
            });
            saveToLocalStorage();
            showNotification('All user progress has been reset.');
            navigate('admin');
        }
    });
}

function deleteUser(username) {
    showModal('Confirm Deletion', `Are you sure you want to delete user "${username}"? This will remove all their data.`, true).then(result => {
        if (result) {
            const isSelfDelete = currentUser && currentUser.username === username;

            users = users.filter(u => u.username !== username);
            scores = scores.filter(s => s.username !== username);
            if (achievements[username]) {
                delete achievements[username];
            }
            saveToLocalStorage();
            showNotification(`User "${username}" has been deleted.`);
            
            if (isSelfDelete) {
                localStorage.removeItem('currentUser');
                updateAuthState();
                navigate('home');
            } else {
                navigate('admin');
            }
        }
    });
}

// 15. 404 Page
function render404Page() {
    fetch('404.html')
        .then(response => response.text())
        .then(html => {
            content.innerHTML = html;
        });
}

// --- Routing Logic ---
const routes = {
    '': renderHomePage,
    'home': renderHomePage,
    'login': renderLoginPage,
    'signup': renderSignupPage,
    'game': renderGamePage,
    'profile': renderProfilePage,
    'leaderboard': renderLeaderboardPage,
    'achievements': renderAchievementsPage,
    'practice': renderPracticePage,
    'topics': renderTopicsPage,
    'about': renderAboutPage,
    'settings': renderSettingsPage,
    'contact': renderContactPage,
    'feedback': renderFeedbackPage,
    'admin': renderAdminPage,
    '404': render404Page,
};

function router() {
    const path = window.location.hash.slice(1) || 'home';
    const page = path.split('?')[0];
    const renderFunction = routes[page] || render404Page;
    
    // Close mobile menu on route change
    mobileMenu.classList.add('hidden');

    // Apply theme setting
    applyTheme();
    
    updateAuthState();
    renderFunction();
}

// Theme toggle functionality
function setupThemeToggle() {
    const toggleIcon = themeToggle.querySelector('i');
    const mobileToggleIcon = themeToggleMobile.querySelector('i');
    
    function updateIcon() {
        const isDark = settings.theme === 'dark';
        const iconClass = isDark ? 'fa-moon' : 'fa-sun';
        toggleIcon.className = `fas ${iconClass}`;
        mobileToggleIcon.className = `fas ${iconClass}`;
    }
    
    updateIcon();
    
    [themeToggle, themeToggleMobile].forEach(toggle => {
        toggle.addEventListener('click', () => {
            settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
            saveToLocalStorage();
            applyTheme();
            updateIcon();
            showNotification(`Switched to ${settings.theme} mode`);
        });
    });
}

// Initial setup
window.addEventListener('load', () => {
    setupThemeToggle();
    router();
});

window.addEventListener('hashchange', router);

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Logout functionality
function handleLogout() {
    showModal('Log Out', 'Are you sure you want to log out?', true).then(result => {
        if (result) {
            // Clear all user-related data from local storage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');

            updateAuthState();
            showNotification('You have been logged out.');
            navigate('home');
        }
    });
}

logoutBtn.addEventListener('click', handleLogout);
mobileLogoutBtn.addEventListener('click', handleLogout);

// Initial auth state check
updateAuthState();
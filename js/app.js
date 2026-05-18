/**
 * Security & PIN Logic
 */
let currentPin = '';
let targetPin = localStorage.getItem('app_pin') || '0000'; // Default PIN

window.handlePinInput = function(val) {
    const dots = document.querySelectorAll('.pin-dot');
    if (val === 'back') {
        currentPin = currentPin.slice(0, -1);
    } else if (currentPin.length < 4) {
        currentPin += val;
    }

    // Update dots
    dots.forEach((dot, i) => {
        if (i < currentPin.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });

    if (currentPin.length === 4) {
        if (currentPin === targetPin) {
            document.getElementById('pinOverlay').style.display = 'none';
            // Start app
            if (typeof loadData === 'function') loadData();
            if (typeof renderDashboard === 'function') renderDashboard();
        } else {
            alert('비밀번호가 틀렸습니다.');
            currentPin = '';
            dots.forEach(dot => dot.classList.remove('filled'));
        }
    }
};

/**
 * Encryption Wrapper
 */
window.encryptData = function(data) {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, targetPin).toString();
};

window.decryptData = function(cipher) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipher, targetPin);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        return null;
    }
};

// Delay app init until PIN is entered
// We override the original window.onload if necessary
 * Security & PIN Logic
 */
let currentPin = '';
let targetPin = localStorage.getItem('app_pin') || '0000'; // Default PIN

function handlePinInput(val) {
    const dots = document.querySelectorAll('.pin-dot');
    if (val === 'back') {
        currentPin = currentPin.slice(0, -1);
    } else if (currentPin.length < 4) {
        currentPin += val;
    }

    // Update dots
    dots.forEach((dot, i) => {
        if (i < currentPin.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });

    if (currentPin.length === 4) {
        if (currentPin === targetPin) {
            document.getElementById('pinOverlay').style.display = 'none';
            initApp();
        } else {
            alert('비밀번호가 틀렸습니다.');
            currentPin = '';
            dots.forEach(dot => dot.classList.remove('filled'));
        }
    }
}

function updatePin() {
    const newPin = document.getElementById('newPinInput').value;
    if (newPin.length === 4) {
        localStorage.setItem('app_pin', newPin);
        targetPin = newPin;
        alert('PIN이 변경되었습니다.');
    } else {
        alert('PIN은 4자리 숫자로 입력하세요.');
    }
}

/**
 * Encryption Wrapper
 */
function encryptData(data) {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, targetPin).toString();
}

function decryptData(cipher) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipher, targetPin);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        return null;
    }
}

/**
 * Modified Data Persistence
 */
const originalSaveData = typeof saveData === 'function' ? saveData : null;
saveData = function() {
    if (originalSaveData) {
        // We override the internal storage logic
        const encrypted = encryptData(appData);
        localStorage.setItem('rental_app_data_enc', encrypted);
        // Also call original if it does sync, etc.
        // originalSaveData.apply(this, arguments);
    }
};

const originalLoadData = typeof loadData === 'function' ? loadData : null;
loadData = function() {
    const encrypted = localStorage.getItem('rental_app_data_enc');
    if (encrypted) {
        const decrypted = decryptData(encrypted);
        if (decrypted) {
            appData = decrypted;
            return;
        }
    }
    if (originalLoadData) originalLoadData.apply(this, arguments);
};

function initApp() {
    loadData();
    if (typeof renderDashboard === 'function') renderDashboard();
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pinOverlay').style.display = 'flex';
});

        // ============================================================
        // ðŸ”¥ FIREBASE ì„¤ì • â€” ì•„ëž˜ ê°’ì„ Firebase consoleì—ì„œ ë³µì‚¬í•´ì„œ ë„£ìœ¼ì„¸ìš”
        //    (í•œ ë²ˆë§Œ ì„¤ì •í•˜ë©´ ìºë‚˜ë‹¤/í•œêµ­ ëª¨ë‘ ìžë™ ì—°ë™)
        //
        // âš ï¸ ë³´ì•ˆ ì£¼ì˜ì‚¬í•­ (SECURITY WARNING):
        //    - ì´ íŒŒì¼ì„ GitHub ê³µê°œ(public) ì €ìž¥ì†Œì— ì˜¬ë¦¬ì§€ ë§ˆì„¸ìš”.
        //    - API í‚¤ê°€ ì™¸ë¶€ì— ë…¸ì¶œë˜ë©´ Firebase í”„ë¡œì íŠ¸ê°€ ì•…ìš©ë  ìˆ˜ ìžˆìŠµë‹ˆë‹¤.
        //    - ë°˜ë“œì‹œ ë¹„ê³µê°œ(private) ì €ìž¥ì†Œì—ë§Œ ë³´ê´€í•˜ì„¸ìš”.
        //    - Firebase Console > ë³´ì•ˆ ê·œì¹™(Security Rules)ì—ì„œ
        //      ì¸ì¦ëœ ì‚¬ìš©ìžë§Œ ì½ê¸°/ì“°ê¸° ê°€ëŠ¥í•˜ë„ë¡ ì„¤ì •í•˜ëŠ” ê²ƒì„ ê¶Œìž¥í•©ë‹ˆë‹¤.
        //    - ì£¼ë¯¼ë“±ë¡ë²ˆí˜¸ ë“± ê°œì¸ì •ë³´ê°€ ì €ìž¥ë  ìˆ˜ ìžˆìœ¼ë¯€ë¡œ ê¸°ê¸° ë¶„ì‹¤ì— ì£¼ì˜í•˜ì„¸ìš”.
        // ============================================================
        const FIREBASE_CONFIG = {
            apiKey:            "AIzaSyCPZU65F9Raxpxrl2cl5ELejxrG25xBbLA",
            authDomain:        "rental-7588e.firebaseapp.com",
            projectId:         "rental-7588e",
            storageBucket:     "rental-7588e.firebasestorage.app",
            messagingSenderId: "749045607853",
            appId:             "1:749045607853:web:fab8ab34ce74f5bd7c4524"
        };
        // ============================================================

        // ============ DATA MODEL ============
        let appData = {
            buildings: [],
            rooms: [],
            tenants: [],
            rents: [],
            expenses: []
        };
        let currentPage = 'dashboardPage';
        let editingId = null;
        let editingType = null;
        let currentTenantFilter = 'all';
        let msalInstance = null;
        let account = null;
        // ============ STORAGE ============
        function cleanupInvalidRents() {
            // ìž…ì£¼ì¼ ì´ì „ ë˜ëŠ” ê³„ì•½ì¢…ë£Œ ì´í›„ì— ìž˜ëª» ìƒì„±ëœ pending monthly ë ˆì½”ë“œ ì‚­ì œ
            const before = appData.rents.length;
            appData.rents = appData.rents.filter(r => {
                if (r.type !== 'monthly' && r.type !== undefined && r.type !== '') return true;
                if (!r.month) return true;
                const tenant = appData.tenants.find(t => t.id === r.tenantId);
                if (!tenant) return true;
                const _mi = (tenant.moveInDate || '').slice(0,7);
                const _cs = (tenant.contractStart || '').slice(0,7);
                const tStart = _mi && _cs ? (_mi > _cs ? _mi : _cs) : (_mi || _cs);
                const tEnd = (tenant.contractEnd || '').slice(0,7);
                // ìž…ì£¼ ì „ ì œê±°: r.monthì™€ ê°™ì€ ì—°ë„ ë‚´ì—ì„œë§Œ ì²´í¬ (ë‹¤ë¥¸ ì—°ë„ë©´ í•´ë‹¹ ì—°ë„ 1ì›”ë¶€í„° ìœ íš¨)
                const rYear = r.month.slice(0,4);
                const tStartYear = tStart ? tStart.slice(0,4) : null;
                const effectiveStart = (tStart && tStartYear === rYear) ? tStart : null;
                if (effectiveStart && r.month < effectiveStart && r.status === 'pending') return false; // ìž…ì£¼ ì „ ë¯¸ë‚© ë ˆì½”ë“œ ì œê±°
                if (tEnd && r.month > tEnd && (r.status === 'pending' || r.status === 'overdue')) return false; // í‡´ì‹¤ í›„ ë¯¸ë‚© ë ˆì½”ë“œ ì œê±°
                return true;
            });
            return appData.rents.length < before; // ì‹¤ì œë¡œ ì œê±°ëœ ë ˆì½”ë“œê°€ ìžˆìœ¼ë©´ true
        }
        function loadData() {
            const stored = localStorage.getItem('appData');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    const requiredKeys = ['buildings','rooms','tenants','rents','expenses'];
                    const isValid = requiredKeys.every(k => Array.isArray(parsed[k]));
                    if (isValid) {
                        appData = parsed;
                    } else {
                        console.warn('appData êµ¬ì¡° ë¶ˆëŸ‰ - ê¸°ë³¸ê°’ ì‚¬ìš©');
                        showToast('âš ï¸ ì €ìž¥ëœ ë°ì´í„° êµ¬ì¡°ì— ì˜¤ë¥˜ê°€ ìžˆì–´ ì´ˆê¸°í™”í•©ë‹ˆë‹¤.');
                        appData = { buildings: [], rooms: [], tenants: [], rents: [], expenses: [] };
                        saveData();
                    }
                } catch (e) {
                    console.error('appData íŒŒì‹± ì‹¤íŒ¨:', e);
                    showToast('âš ï¸ ì €ìž¥ëœ ë°ì´í„°ë¥¼ ì½ì„ ìˆ˜ ì—†ì–´ ì´ˆê¸°í™”í•©ë‹ˆë‹¤.');
                    appData = { buildings: [], rooms: [], tenants: [], rents: [], expenses: [] };
                    saveData();
                }
            }
            updateUI();
            _syncPrevSaveSnapshot();
        }
        /** ì§ì „ ì €ìž¥ ìŠ¤ëƒ…ìƒ· â€” ë³€ê²½ëœ ë ˆì½”ë“œì—ë§Œ updatedAt ë¶€ì—¬ */
        var _prevSaveSnapshot = null;
        function _syncPrevSaveSnapshot() {
            try {
                _prevSaveSnapshot = JSON.stringify(appData);
            } catch (e) {
                _prevSaveSnapshot = null;
            }
        }
        function _stripUpdatedAtForCompare(obj) {
            if (!obj || typeof obj !== 'object') return obj;
            var c = Object.assign({}, obj);
            delete c.updatedAt;
            return c;
        }
        function _stampChangedRecordsSinceLastSave() {
            if (_prevSaveSnapshot == null) return;
            var prev;
            try {
                prev = JSON.parse(_prevSaveSnapshot);
            } catch (e) {
                return;
            }
            var keys = ['buildings', 'rooms', 'tenants', 'rents', 'expenses'];
            var nowIso = new Date().toISOString();
            keys.forEach(function(k) {
                var prevList = prev[k] || [];
                var prevMap = {};
                prevList.forEach(function(p) {
                    if (p && p.id) prevMap[p.id] = p;
                });
                (appData[k] || []).forEach(function(item) {
                    if (!item || !item.id) return;
                    var p = prevMap[item.id];
                    var prevStr = p ? JSON.stringify(_stripUpdatedAtForCompare(p)) : '';
                    var curStr = JSON.stringify(_stripUpdatedAtForCompare(item));
                    if (prevStr !== curStr) item.updatedAt = nowIso;
                });
            });
        }
        function saveData() {
            cleanupInvalidRents();
            // ë³€ê²½ ìš”ì•½ì€ _syncPrevSaveSnapshot() ì „ì— ìƒì„±í•´ì•¼ ì´ì „ ìƒíƒœì™€ ë¹„êµ ê°€ëŠ¥
            var _clSummary = _generateChangeSummary();
            _stampChangedRecordsSinceLastSave();
            try {
                localStorage.setItem('appData', JSON.stringify(appData));
            } catch (e) {
                showToast('âš ï¸ ì €ìž¥ ê³µê°„ì´ ë¶€ì¡±í•©ë‹ˆë‹¤. ì˜¤ëž˜ëœ ì‚¬ì§„ ì²¨ë¶€ë¥¼ ì‚­ì œí•´ ì£¼ì„¸ìš”.', 4000);
                console.error('localStorage ì €ìž¥ ì‹¤íŒ¨:', e);
            }
            if (_db) {
                // Firebase ì‹¤ì‹œê°„ ë™ê¸°í™” (ë””ë°”ìš´ìŠ¤: ì—°ì† ì €ìž¥ ì‹œ 1ì´ˆ í›„ í•œ ë²ˆë§Œ)
                clearTimeout(_fbDebounceTimer);
                _showFbStatus('syncing');
                _fbDebounceTimer = setTimeout(function() { _saveToFirestore(0); }, 750);
            } else {
                debounceSync(); // OneDrive ë™ê¸°í™” (ê¸°ì¡´)
            }
            _syncPrevSaveSnapshot();
            // Changelog: ì‹¤ì œ ë³€ê²½ì´ ìžˆì„ ë•Œë§Œ, 3ì´ˆ ë””ë°”ìš´ìŠ¤ë¡œ ì—°ì† ì €ìž¥ ë¬¶ê¸°
            if (_clSummary && _clSummary !== 'ë³€ê²½ ì—†ìŒ') {
                _changelogPendingSummary = _clSummary;
                clearTimeout(_changelogTimer);
                _changelogTimer = setTimeout(function() {
                    _saveChangelogEntry(_changelogPendingSummary);
                    _changelogPendingSummary = null;
                }, 3000);
            }
        }
        // ============ MODAL MANAGEMENT ============
        let _modalZBase = 1000;
        function openModal(modalId) {
            const el = document.getElementById(modalId);
            if (!el) return;
            // ê¸°ì¡´ì— ì—´ë¦° ëª¨ë‹¬ ëª¨ë‘ ë‹«ê¸° (ëª¨ë‹¬ ì¤‘ì²© ë°©ì§€)
            // â€” includes both .modal-overlay and .td-overlay
            document.querySelectorAll('.modal-overlay.active, .td-overlay.active').forEach(m => {
                if (m.id !== modalId) {
                    m.classList.remove('active');
                    m.style.zIndex = '';
                    // reset td bottom bar if closing tenant detail
                    if (m.id === 'tenantDetailModal') {
                        var bb = document.getElementById('tdBottomBar');
                        if (bb) bb.style.display = 'none';
                    }
                }
            });
            _modalZBase++;
            el.style.zIndex = _modalZBase;
            el.classList.add('active');
            if (document.body.style.overflow !== 'hidden') {
                document.body._savedScrollY = window.scrollY;
            }
            document.body.style.overflow = 'hidden'; // ë°°ê²½ ìŠ¤í¬ë¡¤ ë°©ì§€
            // Android í•˜ë“œì›¨ì–´ ë’¤ë¡œê°€ê¸°ë¥¼ ëª¨ë‹¬ ë‹«ê¸°ë¡œ ì²˜ë¦¬
            history.pushState({ modal: modalId }, '');
            editingId = null;
            editingType = null;
            if (modalId === 'addBuildingModal') {
                document.getElementById('deleteBuildingBtn').style.display = 'none';
                document.getElementById('buildingModalTitle').textContent = 'ê±´ë¬¼ ì¶”ê°€';
                document.getElementById('buildingName').value = '';
                document.getElementById('buildingAddress').value = '';
                document.getElementById('buildingType').value = '';
                document.getElementById('buildingRooms').value = '';
                document.getElementById('buildingMemo').value = '';
                document.getElementById('buildingRoomsList').innerHTML = '';
                document.getElementById('buildingRoomsSection').style.display = 'block';
            } else if (modalId === 'addTenantModal') {
                document.getElementById('deleteTenantBtn').style.display = 'none';
                document.getElementById('tenantModalTitle').textContent = 'ì„¸ìž…ìž ì¶”ê°€';
                clearTenantForm();
                loadAllRooms();
            } else if (modalId === 'addExpenseModal') {
                document.getElementById('deleteExpenseBtn').style.display = 'none';
                document.getElementById('expenseModalTitle').textContent = 'ì§€ì¶œ ì¶”ê°€';
                document.getElementById('expenseTitle').value = '';
                document.getElementById('expenseAmount').value = '';
                document.getElementById('expenseCategory').value = '';
                document.getElementById('expenseMemo').value = '';
                document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
                _pendingReceipts = [];
                renderReceiptPreviews();
                loadExpenseModalRooms();
            }
        }
        function closeModal(modalId) {
            const el = document.getElementById(modalId);
            if (!el) return;
            el.classList.remove('active');
            el.style.zIndex = '';
            // ì—´ë¦° ëª¨ë‹¬ì´ í•˜ë‚˜ë„ ì—†ìœ¼ë©´ ë°°ê²½ ìŠ¤í¬ë¡¤ ë³µì›
            const anyOpen = document.querySelectorAll('.modal-overlay.active, .td-overlay.active').length > 0;
            if (!anyOpen) {
                document.body.style.overflow = '';
                const sy = document.body._savedScrollY;
                if (sy != null) { window.scrollTo(0, sy); document.body._savedScrollY = null; }
            }
        }
        // ë°© ëª¨ë‹¬ ë‹«ê¸° â€“ ê±´ë¬¼ ìƒì„¸ì—ì„œ ì—´ì—ˆìœ¼ë©´ ê±´ë¬¼ ìƒì„¸ë¡œ ë³µê·€
        function closeRoomModalWithBack() {
            closeModal('addRoomModal');
            if (currentBuildingId) {
                showBuildingDetail(currentBuildingId);
            }
        }
        // ============ PAGE NAVIGATION ============
        function switchPage(pageId) {
            const target = document.getElementById(pageId);
            if (!target) return;
            const pages = document.querySelectorAll('.page');
            pages.forEach(p => p.classList.remove('active'));
            target.classList.add('active');
            // nav-item í•˜ì´ë¼ì´íŠ¸ â€“ ì–´ë””ì„œ í˜¸ì¶œë˜ë“  pageId ê¸°ì¤€ìœ¼ë¡œ ì„¤ì •
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(n => {
                const isTarget = n.getAttribute('onclick')?.includes(pageId);
                n.classList.toggle('active', !!isTarget);
            });
            currentPage = pageId;
            if (pageId === 'tenantsPage') {
                currentTenantFilter = 'active';
                // ì„¸ìž…ìž íƒ­ ìƒíƒœ ì´ˆê¸°í™”: í˜„ì„¸ìž…ìž íƒ­ í™œì„±
                var ct = document.getElementById('currentTenantSection');
                var pt = document.getElementById('pastTenantSection');
                if (ct) ct.style.display = 'block';
                if (pt) pt.style.display = 'none';
                renderTenants();
            }
            else if (pageId === 'rentPage') { loadRentBuildingFilter(); renderRents(); }
            else if (pageId === 'expensesPage') { _selectedExpenseRooms.clear(); loadExpenseFilterRooms(); renderExpenses(); }
            else if (pageId === 'dashboardPage') renderDashboard();
            else if (pageId === 'taxPage') openTaxPage();
            else if (pageId === 'settingsPage') _updateFirebaseSettingsUI();
        }
        // ============ BUILDING ROOM ROWS ============
        function addRoomRowToBuilding() {
            const container = document.getElementById('buildingRoomsList');
            const row = document.createElement('div');
            row.className = 'room-entry-row';
            const inp = 'padding: 7px 5px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 14px; -webkit-user-select: text; user-select: text; width: 100%;';
            row.style.cssText = 'display: grid; grid-template-columns: 1fr 0.6fr 1fr 1fr 1fr auto; gap: 4px; margin-bottom: 6px; align-items: center;';
            row.innerHTML = `
                <input type="text" placeholder="101í˜¸" style="${inp}">
                <input type="number" placeholder="1" min="1" style="${inp}">
                <input type="number" placeholder="ì›”ì„¸" min="0" style="${inp}">
                <input type="number" placeholder="ë³´ì¦ê¸ˆ" min="0" style="${inp}">
                <input type="number" placeholder="ì²­ì†Œë¹„" min="0" style="${inp}">
                <button type="button" onclick="this.closest('.room-entry-row').remove()" style="background: #fee2e2; color: var(--danger); border: none; border-radius: 6px; width: 28px; height: 32px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">âœ•</button>
            `;
            container.appendChild(row);
            row.querySelector('input').focus();
        }
        // ============ BUILDINGS ============
        function saveBuilding(e) {
            e.preventDefault();
            const buildingData = {
                id: editingId || Date.now().toString(),
                name: document.getElementById('buildingName').value,
                address: document.getElementById('buildingAddress').value,
                type: document.getElementById('buildingType').value,
                totalRooms: parseInt(document.getElementById('buildingRooms').value),
                memo: document.getElementById('buildingMemo').value,
                createdAt: editingId ? ((appData.buildings.find(b => b.id === editingId) || {}).createdAt || new Date().toISOString()) : new Date().toISOString()
            };
            if (editingId) {
                const index = appData.buildings.findIndex(b => b.id === editingId);
                if (index === -1) {
                    showToast('âš ï¸ ìˆ˜ì •í•  ê±´ë¬¼ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
                    return;
                }
                appData.buildings[index] = buildingData;
            } else {
                appData.buildings.push(buildingData);
                // í˜¸ìˆ˜ í•¨ê»˜ ì €ìž¥
                const roomRows = document.querySelectorAll('#buildingRoomsList .room-entry-row');
                let roomCount = 0;
                roomRows.forEach((row, roomIdx) => {
                    const inputs = row.querySelectorAll('input');
                    const roomNumber = inputs[0].value.trim();
                    if (roomNumber) {
                        appData.rooms.push({
                            id: Date.now().toString() + '-' + roomIdx + '-' + Math.random().toString(36).slice(2, 11),
                            buildingId: buildingData.id,
                            roomNumber: roomNumber,
                            roomCount: parseInt(inputs[1].value) || 1,
                            monthlyRent: parseInt(inputs[2].value) || 0,
                            managementFee: 0,
                            deposit: parseInt(inputs[3].value) || 0,
                            cleaningFee: parseInt(inputs[4].value) || 0,
                            status: 'vacant',
                            memo: ''
                        });
                        roomCount++;
                    }
                });
                if (roomCount > 0) {
                    showToast(`ê±´ë¬¼ ì¶”ê°€ + í˜¸ìˆ˜ ${roomCount}ê°œ ë“±ë¡ ì™„ë£Œ!`);
                } else {
                    showToast('ê±´ë¬¼ì´ ì¶”ê°€ë˜ì—ˆìŠµë‹ˆë‹¤');
                }
            }
            saveData();
            closeModal('addBuildingModal');
            renderBuildings();
            if (editingId) showToast('ê±´ë¬¼ì´ ìˆ˜ì •ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function editBuilding(id) {
            const building = appData.buildings.find(b => b.id === id);
            if (!building) {
                showToast('âš ï¸ ê±´ë¬¼ ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
                return;
            }
            openModal('addBuildingModal');
            editingId = id;
            document.getElementById('buildingName').value = building.name;
            document.getElementById('buildingAddress').value = building.address;
            document.getElementById('buildingType').value = building.type;
            document.getElementById('buildingRooms').value = building.totalRooms;
            document.getElementById('buildingMemo').value = building.memo;
            document.getElementById('buildingModalTitle').textContent = 'ê±´ë¬¼ ìˆ˜ì •';
            document.getElementById('deleteBuildingBtn').style.display = 'block';
            document.getElementById('buildingRoomsSection').style.display = 'none';
        }
        function deleteBuilding() {
            const _bid = editingId;
            showConfirm('ê±´ë¬¼ì„ ì‚­ì œí•˜ë©´ í•´ë‹¹ ê±´ë¬¼ì˜ ë°©, ì„¸ìž…ìž, ìˆ˜ë‚©ê¸°ë¡, ì§€ì¶œê¸°ë¡ì´ ëª¨ë‘ ì‚­ì œë©ë‹ˆë‹¤.\nì •ë§ ì‚­ì œí•˜ì‹œê² ìŠµë‹ˆê¹Œ?', function() {
                const deletedRoomIds = appData.rooms
                    .filter(r => r.buildingId === _bid)
                    .map(r => r.id);
                appData.tenants  = appData.tenants.filter(t => !deletedRoomIds.includes(t.roomId));
                appData.rents    = appData.rents.filter(r => !deletedRoomIds.includes(r.roomId));
                appData.expenses = appData.expenses.filter(e => e.buildingId !== _bid);
                appData.rooms    = appData.rooms.filter(r => r.buildingId !== _bid);
                appData.buildings = appData.buildings.filter(b => b.id !== _bid);
                currentBuildingId = null;
                saveData();
                closeModal('addBuildingModal');
                renderBuildings();
                renderDashboard();
                showToast('ê±´ë¬¼ ë° ê´€ë ¨ ë°ì´í„°ê°€ ëª¨ë‘ ì‚­ì œë˜ì—ˆìŠµë‹ˆë‹¤');
            });
        }
        function renderBuildings() {
            const container = document.getElementById('buildingsList');
            if (!container) return; // ê±´ë¬¼ íŽ˜ì´ì§€ ì—†ìœ¼ë©´ ë¬´ì‹œ
            container.innerHTML = '';
            if (appData.buildings.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ¢</div><p>ë“±ë¡ëœ ê±´ë¬¼ì´ ì—†ìŠµë‹ˆë‹¤</p><button class="btn btn-primary" style="margin-top:16px;" onclick="openModal(\'addBuildingModal\')">+ ê±´ë¬¼ ì¶”ê°€</button></div>';
                return;
            }
            appData.buildings.forEach(building => {
                const buildingRooms = appData.rooms.filter(r => r.buildingId === building.id);
                const occupiedRooms = buildingRooms.filter(r => r.status === 'occupied').length;
                const occupancyRate = buildingRooms.length > 0 ? Math.round((occupiedRooms / buildingRooms.length) * 100) : 0;
                const monthlyIncome = buildingRooms.reduce((sum, room) => {
                    const tenant = appData.tenants.find(t => t.roomId === room.id && t.status === 'active');
                    return sum + (tenant ? (tenant.monthlyRent + (tenant.managementFee || 0)) : 0);
                }, 0);
                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = () => showBuildingDetail(building.id);
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${building.name}</h3>
                            <p style="font-size: 14px; color: var(--neutral-gray); margin-bottom: 8px;">${building.address}</p>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div style="font-size: 14px;"><span style="color: var(--neutral-gray);">ì„¸ëŒ€ìˆ˜</span> <span style="font-weight: 600; color: var(--primary);">${buildingRooms.length}</span></div>
                                <div style="font-size: 14px;"><span style="color: var(--neutral-gray);">ìž…ì£¼ìœ¨</span> <span style="font-weight: 600; color: var(--success);">${occupancyRate}%</span></div>
                                <div style="font-size: 14px; grid-column: 1/-1;"><span style="color: var(--neutral-gray);">ì´ë²ˆë‹¬ ìˆ˜ìž…</span> <span style="font-weight: 600; color: var(--primary);">â‚©${monthlyIncome.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
        function showBuildingDetail(buildingId) {
            const building = appData.buildings.find(b => b.id === buildingId);
            if (!building) {
                showToast('âš ï¸ ê±´ë¬¼ ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
                return;
            }
            const buildingRooms = appData.rooms.filter(r => r.buildingId === buildingId);
            const buildingRents = appData.rents.filter(r => r.buildingId === buildingId);
            const buildingExpenses = appData.expenses.filter(e => e.buildingId === buildingId);
            const monthStr = getMonthStr(new Date());
            const monthRents = buildingRents.filter(r => r.month === monthStr);
            const paidAmount = monthRents.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
            const unpaidAmount = monthRents.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
            const monthExpenses = buildingExpenses.filter(e => (e.date || '').startsWith(monthStr));
            const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
            let html = `
                <div class="card">
                    <h3 style="font-weight: 600; margin-bottom: 12px;">${building.name}</h3>
                    <div style="font-size: 15px; color: var(--neutral-gray); line-height: 1.6;">
                        <div>ðŸ“ ${building.address}</div>
                        <div>ðŸ·ï¸ ${building.type}</div>
                        ${building.memo ? `<div>ðŸ“ ${building.memo}</div>` : ''}
                    </div>
                </div>
                <h4 style="margin: 16px 8px 8px; font-size: 16px; font-weight: 700;">ì´ë²ˆë‹¬ í˜„í™©</h4>
                <div class="income-breakdown">
                    <div class="income-item">
                        <div class="income-item-label">ìˆ˜ë‚©ì™„ë£Œ</div>
                        <div class="income-item-value">â‚©${paidAmount.toLocaleString()}</div>
                    </div>
                    <div class="income-item" style="background: rgba(239, 68, 68, 0.1);">
                        <div class="income-item-label">ë¯¸ë‚©</div>
                        <div class="income-item-value" style="color: var(--danger);">â‚©${unpaidAmount.toLocaleString()}</div>
                    </div>
                    <div class="income-item" style="background: rgba(249, 115, 22, 0.1);">
                        <div class="income-item-label">ì§€ì¶œ</div>
                        <div class="income-item-value" style="color: #ea580c;">â‚©${totalExpenses.toLocaleString()}</div>
                    </div>
                    <div class="income-item" style="background: rgba(34, 197, 94, 0.1);">
                        <div class="income-item-label">ìˆœì´ìµ</div>
                        <div class="income-item-value" style="color: var(--success);">â‚©${(paidAmount - totalExpenses).toLocaleString()}</div>
                    </div>
                </div>
                <h4 style="margin: 16px 8px 8px; font-size: 16px; font-weight: 700;">ë°© í˜„í™©</h4>
                <div class="room-grid">
            `;
            buildingRooms.forEach(room => {
                // í˜„ìž¬ ì„¸ìž…ìž: active ì¤‘ ê°€ìž¥ ìµœê·¼ ìž…ì£¼ìž
                const activeTenants = appData.tenants.filter(t => t.roomId === room.id && t.status === 'active');
                activeTenants.sort((a, b) => new Date(b.contractStart || 0) - new Date(a.contractStart || 0));
                const tenant = activeTenants[0] || null;
                const statusText = room.status === 'vacant' ? 'ê³µì‹¤' : room.status === 'maintenance' ? 'ìˆ˜ë¦¬ì¤‘' : 'ìž…ì£¼ì¤‘';
                html += `
                    <div class="room-cell ${room.status}" onclick="editRoom('${room.id}')">
                        <div class="room-cell-number">${room.roomNumber}</div>
                        ${tenant ? `<div class="room-cell-tenant">${tenant.name}</div>` : ''}
                        <div class="room-cell-status">${statusText}</div>
                    </div>
                `;
            });
            html += `
                </div>
                <button class="btn btn-secondary btn-block" onclick="addRoomToBuilding('${building.id}')">+ ë°© ì¶”ê°€</button>
            `;
            document.getElementById('buildingDetailTitle').textContent = building.name;
            document.getElementById('buildingDetailContent').innerHTML = html;
            openModal('buildingDetailModal');
        }
        function addRoomToBuilding(buildingId) {
            currentBuildingId = buildingId;
            document.getElementById('roomNumber').value = '';
            document.getElementById('roomCount').value = '';
            document.getElementById('roomRent').value = '';
            document.getElementById('roomManagementFee').value = '';
            document.getElementById('roomDeposit').value = '';
            document.getElementById('roomCleaningFee').value = '';
            document.getElementById('roomStatus').value = 'vacant';
            document.getElementById('roomMemo').value = '';
            document.getElementById('deleteRoomBtn').style.display = 'none';
            editingId = null;
            closeModal('buildingDetailModal');
            openModal('addRoomModal');
        }
        // ============ ROOMS ============
        let currentBuildingId = null;
        function saveRoom(e) {
            e.preventDefault();
            const roomNumber = document.getElementById('roomNumber').value.trim();
            let buildingId = currentBuildingId;
            if (editingId) {
                const existingRoom = appData.rooms.find(r => r.id === editingId);
                if (!existingRoom) {
                    showToast('âš ï¸ ë°© ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
                    return;
                }
                buildingId = existingRoom.buildingId;
            }
            if (!buildingId) {
                showToast('âš ï¸ ê±´ë¬¼ì´ ì§€ì •ë˜ì§€ ì•Šì•˜ìŠµë‹ˆë‹¤.');
                return;
            }
            // ê°™ì€ ê±´ë¬¼ ë‚´ ì¤‘ë³µ í˜¸ìˆ˜ ì²´í¬
            const duplicate = appData.rooms.find(r =>
                r.buildingId === buildingId &&
                r.roomNumber === roomNumber &&
                r.id !== editingId
            );
            if (duplicate) {
                showToast('âš ï¸ ê°™ì€ ê±´ë¬¼ì— ì´ë¯¸ ì¡´ìž¬í•˜ëŠ” í˜¸ìˆ˜ìž…ë‹ˆë‹¤');
                return;
            }
            // ê¸°ì¡´ ë°©ì˜ ìˆ˜ë¦¬ ë©”ëª¨/ë‚ ì§œë¥¼ ìœ ì§€í•˜ê¸° ìœ„í•´ ì´ì „ ê°’ ìº¡ì²˜
            const _existingRoom = editingId ? appData.rooms.find(r => r.id === editingId) : null;
            const newStatus = document.getElementById('roomStatus').value;
            const roomData = {
                id: editingId || Date.now().toString(),
                buildingId: buildingId,
                roomNumber: roomNumber,
                roomCount: parseInt(document.getElementById('roomCount').value) || 1,
                monthlyRent: parseInt(document.getElementById('roomRent').value) || 0,
                managementFee: parseInt(document.getElementById('roomManagementFee').value) || 0,
                deposit: parseInt(document.getElementById('roomDeposit').value) || 0,
                cleaningFee: parseInt(document.getElementById('roomCleaningFee').value) || 0,
                status: newStatus,
                memo: document.getElementById('roomMemo').value,
                // ìˆ˜ë¦¬ ê´€ë ¨ í•„ë“œëŠ” ê¸°ì¡´ ê°’ ë³´ì¡´
                maintMemo: _existingRoom ? (_existingRoom.maintMemo || '') : '',
                maintStartDate: _existingRoom ? (_existingRoom.maintStartDate || '') : '',
                maintEstCost: _existingRoom ? (_existingRoom.maintEstCost || 0) : 0
            };
            if (editingId) {
                const index = appData.rooms.findIndex(r => r.id === editingId);
                appData.rooms[index] = roomData;
            } else {
                appData.rooms.push(roomData);
            }
            const wasEditing = !!editingId;
            saveData();
            closeModal('addRoomModal');
            renderBuildings();
            if (currentBuildingId) showBuildingDetail(currentBuildingId);
            showToast(wasEditing ? 'ë°©ì´ ìˆ˜ì •ë˜ì—ˆìŠµë‹ˆë‹¤' : 'ë°©ì´ ì¶”ê°€ë˜ì—ˆìŠµë‹ˆë‹¤');
            // ìƒˆë¡œ maintenance ìƒíƒœë¡œ ë°”ë€Œì—ˆê³  ì•„ì§ ìˆ˜ë¦¬ ë©”ëª¨ê°€ ì—†ìœ¼ë©´ ìˆ˜ë¦¬ ì •ë³´ ëª¨ë‹¬ ìžë™ ì˜¤í”ˆ
            const wasMaintenance = _existingRoom && _existingRoom.status === 'maintenance';
            if (newStatus === 'maintenance' && !wasMaintenance) {
                openMaintenanceModal(roomData.id);
            }
        }
        function editRoom(roomId) {
            const room = appData.rooms.find(r => r.id === roomId);
            if (!room) {
                showToast('âš ï¸ ë°© ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.');
                return;
            }
            currentBuildingId = room.buildingId;
            // openModal ë¨¼ì € (ë‚´ë¶€ì—ì„œ editingId=null ì´ˆê¸°í™”ë˜ë¯€ë¡œ)
            openModal('addRoomModal');
            // openModal ì´í›„ì— editingId ì„¤ì •í•´ì•¼ ì‚­ì œ/ìˆ˜ì •ì´ ì˜¬ë°”ë¥´ê²Œ ë™ìž‘
            editingId = roomId;
            document.getElementById('roomNumber').value = room.roomNumber;
            document.getElementById('roomCount').value = room.roomCount || 1;
            document.getElementById('roomRent').value = room.monthlyRent;
            document.getElementById('roomManagementFee').value = room.managementFee || 0;
            document.getElementById('roomDeposit').value = room.deposit;
            document.getElementById('roomCleaningFee').value = room.cleaningFee || 0;
            document.getElementById('roomStatus').value = room.status;
            document.getElementById('roomMemo').value = room.memo;
            document.getElementById('deleteRoomBtn').style.display = 'block';
        }
        function deleteRoom() {
            const _rid = editingId;
            showConfirm('ë°©ì„ ì‚­ì œí•˜ë©´ í•´ë‹¹ ë°©ì˜ ì„¸ìž…ìž, ìˆ˜ë‚© ê¸°ë¡, ì§€ì¶œ ê¸°ë¡ì´ ëª¨ë‘ ì‚­ì œë©ë‹ˆë‹¤.\nì •ë§ ì‚­ì œí•˜ì‹œê² ìŠµë‹ˆê¹Œ?', function() {
                const deletedTenantIds = appData.tenants
                    .filter(t => t.roomId === _rid)
                    .map(t => t.id);
                appData.rooms    = appData.rooms.filter(r => r.id !== _rid);
                appData.tenants  = appData.tenants.filter(t => t.roomId !== _rid);
                appData.rents    = appData.rents.filter(r => r.roomId !== _rid && !deletedTenantIds.includes(r.tenantId));
                appData.expenses = appData.expenses.filter(e => e.roomId !== _rid);
                saveData();
                closeModal('addRoomModal');
                renderBuildings();
                renderDashboard();
                if (currentBuildingId) showBuildingDetail(currentBuildingId);
                showToast('ë°© ë° ê´€ë ¨ ë°ì´í„°ê°€ ì‚­ì œë˜ì—ˆìŠµë‹ˆë‹¤');
            });
        }
        // ============ TENANTS ============
        function clearTenantForm() {
            document.getElementById('tenantRoom').value = '';
            document.getElementById('tenantRentType').value = 'monthly';
            document.getElementById('tenantName').value = '';
            document.getElementById('tenantResidentId').value = '';
            document.getElementById('tenantPhone').value = '';
            document.getElementById('tenantBirthday').value = '';
            document.getElementById('tenantOccupation').value = '';
            document.getElementById('tenantEmail').value = '';
            document.getElementById('tenantContractStart').value = '';
            document.getElementById('tenantContractEnd').value = '';
            document.getElementById('tenantRent').value = '';
            document.getElementById('tenantManagementFee').value = '';
            document.getElementById('tenantDeposit').value = '';
            document.getElementById('tenantCleaningFee').value = '';
            document.getElementById('tenantPayDay').value = '';
            document.getElementById('tenantMoveInDate').value = '';
            document.getElementById('tenantMemo').value = '';
            document.getElementById('tenantEmergencyName').value = '';
            document.getElementById('tenantEmergencyPhone').value = '';
            document.getElementById('tenantGuarantorName').value = '';
            document.getElementById('tenantGuarantorPhone').value = '';
            document.getElementById('tenantGuarantorRelation').value = '';
            toggleRentTypeFields();
        }
        function loadBuildingSelect(selectId) {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">ì„ íƒí•˜ì„¸ìš”</option>';
            appData.buildings.forEach(b => {
                select.innerHTML += `<option value="${b.id}">${b.name}</option>`;
            });
        }
        function loadBuildingRooms() { loadAllRooms(); } // í•˜ìœ„ í˜¸í™˜ì„± ìœ ì§€
        function loadAllRooms() {
            const roomSelect = document.getElementById('tenantRoom');
            roomSelect.innerHTML = '<option value="">ì„ íƒí•˜ì„¸ìš”</option>';
            const sorted = [...appData.rooms].sort((a, b) => {
                const ba = appData.buildings.find(b2 => b2.id === a.buildingId)?.name || '';
                const bb = appData.buildings.find(b2 => b2.id === b.buildingId)?.name || '';
                return ba.localeCompare(bb) || a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
            });
            sorted.forEach(r => {
                const bName = appData.buildings.find(b2 => b2.id === r.buildingId)?.name || '';
                roomSelect.innerHTML += `<option value="${r.id}">${bName} ${r.roomNumber}í˜¸</option>`;
            });
        }
        function toggleRentTypeFields() {
            const rentType = document.getElementById('tenantRentType').value;
            const isAnnual = rentType === 'annual';
            document.getElementById('managementFeeRow').style.display = isAnnual ? 'none' : '';
            document.getElementById('payDayRow').style.display = isAnnual ? 'none' : '';
            document.getElementById('rentLabel').innerHTML = isAnnual
                ? 'ì—°ì„¸ <span style="font-size: 13px; color: var(--neutral-gray);">(ì—° 1íšŒ)</span>'
                : 'ì›”ì„¸ <span style="font-size: 13px; color: var(--neutral-gray);">(ë§¤ì›”)</span>';
        }
        function loadExpenseRooms() { loadExpenseModalRooms(); } // í•˜ìœ„ í˜¸í™˜
        function loadExpenseModalRooms() {
            const roomSelect = document.getElementById('expenseRoom');
            if (!roomSelect) return;
            roomSelect.innerHTML = '<option value="">ì „ì²´</option>';
            const sorted = [...appData.rooms].sort((a, b) => {
                const ba = appData.buildings.find(b2 => b2.id === a.buildingId)?.name || '';
                const bb = appData.buildings.find(b2 => b2.id === b.buildingId)?.name || '';
                return ba.localeCompare(bb) || a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
            });
            sorted.forEach(r => {
                const bName = appData.buildings.find(b2 => b2.id === r.buildingId)?.name || '';
                roomSelect.innerHTML += `<option value="${r.id}">${bName} ${r.roomNumber}í˜¸</option>`;
            });
        }
        let _selectedExpenseRooms = new Set(); // ì„ íƒëœ í˜¸ì‹¤ ID ëª©ë¡
        let _selectedExpenses = new Set();    // ì²´í¬ëœ ì§€ì¶œ ID (ì˜ìˆ˜ì¦ ê³µìœ /í”„ë¦°íŠ¸ìš©)
        let _pendingReceipts = [];            // ëª¨ë‹¬ì—ì„œ ìž„ì‹œ ë³´ê´€ ì¤‘ì¸ base64 ì´ë¯¸ì§€ ë°°ì—´
        let _viewerReceipts = [];             // ë·°ì–´ì—ì„œ í‘œì‹œí•  ì´ë¯¸ì§€ ë°°ì—´
        let _viewerIdx = 0;                   // ë·°ì–´ í˜„ìž¬ ì¸ë±ìŠ¤
        function loadExpenseFilterRooms() {
            const container = document.getElementById('expenseFilterRoom');
            const sorted = [...appData.rooms].sort((a, b) => {
                const ba = appData.buildings.find(b2 => b2.id === a.buildingId)?.name || '';
                const bb = appData.buildings.find(b2 => b2.id === b.buildingId)?.name || '';
                return ba.localeCompare(bb) || a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
            });
            let html = `<button class="filter-btn active" data-room-id="" onclick="toggleExpenseFilter(this)">ì „ì²´</button>`;
            sorted.forEach(r => {
                const bName = appData.buildings.find(b2 => b2.id === r.buildingId)?.name || '';
                const isActive = _selectedExpenseRooms.has(r.id) ? ' active' : '';
                html += `<button class="filter-btn${isActive}" data-room-id="${r.id}" onclick="toggleExpenseFilter(this)">${bName} ${r.roomNumber}í˜¸</button>`;
            });
            container.innerHTML = html;
            _updateAllBtn();
        }
        function toggleExpenseFilter(btn) {
            const roomId = btn.dataset.roomId;
            if (roomId === '') {
                // ì „ì²´ ë²„íŠ¼ â†’ ì„ íƒ ì´ˆê¸°í™”
                _selectedExpenseRooms.clear();
            } else {
                if (_selectedExpenseRooms.has(roomId)) {
                    _selectedExpenseRooms.delete(roomId);
                } else {
                    _selectedExpenseRooms.add(roomId);
                }
            }
            // ë²„íŠ¼ ìƒíƒœ ê°±ì‹ 
            document.querySelectorAll('#expenseFilterRoom .filter-btn').forEach(b => {
                const id = b.dataset.roomId;
                if (id === '') {
                    b.classList.toggle('active', _selectedExpenseRooms.size === 0);
                } else {
                    b.classList.toggle('active', _selectedExpenseRooms.has(id));
                }
            });
            renderExpenses();
        }
        function _updateAllBtn() {
            const allBtn = document.querySelector('#expenseFilterRoom .filter-btn[data-room-id=""]');
            if (allBtn) allBtn.classList.toggle('active', _selectedExpenseRooms.size === 0);
        }
        function saveTenant(e) {
            e.preventDefault();
            const roomId = document.getElementById('tenantRoom').value;
            const selectedRoom = appData.rooms.find(r => r.id === roomId);
            const buildingId = selectedRoom?.buildingId || '';
            const tenantName = document.getElementById('tenantName').value.trim();
            const rentType = document.getElementById('tenantRentType').value || 'monthly';
            if (!roomId) { showToast('âš ï¸ í˜¸ìˆ˜ë¥¼ ì„ íƒí•´ì£¼ì„¸ìš”'); return; }
            if (!tenantName) { showToast('âš ï¸ ì„¸ìž…ìž ì´ë¦„ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            const _cs = document.getElementById('tenantContractStart').value;
            const _ce = document.getElementById('tenantContractEnd').value;
            if (_cs && _ce && _cs >= _ce) { showToast('âš ï¸ ê³„ì•½ ì¢…ë£Œì¼ì´ ì‹œìž‘ì¼ë³´ë‹¤ ë‚˜ì¤‘ì´ì–´ì•¼ í•©ë‹ˆë‹¤'); return; }
            const _rentVal = parseInt(document.getElementById('tenantRent').value);
            if (isNaN(_rentVal) || _rentVal < 0) { showToast('âš ï¸ ì˜¬ë°”ë¥¸ ì›”ì„¸ ê¸ˆì•¡ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            const tenantData = {
                id: editingId || Date.now().toString(),
                roomId: roomId,
                buildingId: buildingId,
                name: tenantName,
                residentId: document.getElementById('tenantResidentId').value,
                phone: document.getElementById('tenantPhone').value,
                birthday: document.getElementById('tenantBirthday').value || '',
                occupation: document.getElementById('tenantOccupation').value.trim() || '',
                email: document.getElementById('tenantEmail').value.trim() || '',
                contractStart: document.getElementById('tenantContractStart').value,
                contractEnd: document.getElementById('tenantContractEnd').value,
                rentType: rentType,
                monthlyRent: parseInt(document.getElementById('tenantRent').value) || 0,
                managementFee: rentType === 'annual' ? 0 : (parseInt(document.getElementById('tenantManagementFee').value) || 0),
                deposit: parseInt(document.getElementById('tenantDeposit').value) || 0,
                cleaningFee: parseInt(document.getElementById('tenantCleaningFee').value) || 0,
                payDay: parseInt(document.getElementById('tenantPayDay').value) || 1,
                moveInDate: document.getElementById('tenantMoveInDate').value,
                memo: document.getElementById('tenantMemo').value,
                emergencyName: document.getElementById('tenantEmergencyName').value.trim() || '',
                emergencyPhone: document.getElementById('tenantEmergencyPhone').value.trim() || '',
                guarantorName: document.getElementById('tenantGuarantorName').value.trim() || '',
                guarantorPhone: document.getElementById('tenantGuarantorPhone').value.trim() || '',
                guarantorRelation: document.getElementById('tenantGuarantorRelation').value.trim() || '',
                status: editingId ? (appData.tenants.find(t => t.id === editingId)?.status || 'active') : 'active',
                depositRefunded: editingId ? (appData.tenants.find(t => t.id === editingId)?.depositRefunded || false) : false,
                depositRefundDate: editingId ? (appData.tenants.find(t => t.id === editingId)?.depositRefundDate || '') : '',
                rentHistory: editingId ? (appData.tenants.find(t => t.id === editingId)?.rentHistory || []) : []
            };
            if (editingId) {
                const oldTenant = appData.tenants.find(t => t.id === editingId);
                const oldRoomId = oldTenant ? oldTenant.roomId : null;
                const index = appData.tenants.findIndex(t => t.id === editingId);
                // ì›”ì„¸ ê¸ˆì•¡ ë³€ê²½ ì‹œ ê¸°ì¡´ ë¯¸ë‚© ê¸°ë¡ì€ ìžë™ ë³€ê²½ë˜ì§€ ì•ŠìŒì„ ì•ˆë‚´
                if (oldTenant && (oldTenant.monthlyRent !== tenantData.monthlyRent || (oldTenant.managementFee || 0) !== (tenantData.managementFee || 0))) {
                    const hasExisting = appData.rents.some(r => r.tenantId === editingId && (!r.type || r.type === 'monthly') && (r.status === 'pending' || r.status === 'overdue'));
                    if (hasExisting) showToast('âš ï¸ ì›”ì„¸ ê¸ˆì•¡ì´ ë³€ê²½ë˜ì—ˆìŠµë‹ˆë‹¤. ê¸°ì¡´ ë¯¸ë‚© ê¸°ë¡ì€ ìˆ˜ë™ìœ¼ë¡œ ìˆ˜ì •í•´ ì£¼ì„¸ìš”.', 4000);
                    // ì›”ì„¸ ì¸ìƒ ì´ë ¥ ê¸°ë¡ (ì´ì „ ê¸ˆì•¡ + ì¢…ë£Œì‹œì  = ì˜¤ëŠ˜)
                    tenantData.rentHistory = (tenantData.rentHistory || []).concat([{
                        monthlyRent: oldTenant.monthlyRent || 0,
                        managementFee: oldTenant.managementFee || 0,
                        from: oldTenant.contractStart || '',
                        to: new Date().toISOString().split('T')[0],
                        reason: 'edit'
                    }]);
                }
                appData.tenants[index] = tenantData;
                // í˜¸ì‹¤ì´ ë³€ê²½ëœ ê²½ìš°: ì´ì „ ë°© â†’ ê³µì‹¤, ìƒˆ ë°© â†’ ìž…ì£¼ì¤‘
                if (oldRoomId && oldRoomId !== roomId) {
                    const oldRoom = appData.rooms.find(r => r.id === oldRoomId);
                    if (oldRoom && oldRoom.status === 'occupied') oldRoom.status = 'vacant';
                    const newRoom = appData.rooms.find(r => r.id === roomId);
                    if (newRoom) newRoom.status = 'occupied';
                }
            } else {
                appData.tenants.push(tenantData);
                // Auto-set room status to occupied
                const room = appData.rooms.find(r => r.id === roomId);
                if (room) room.status = 'occupied';
                // Auto-create deposit record (ë³´ì¦ê¸ˆ: ìž…ì£¼ ì „ 1íšŒ)
                if (tenantData.deposit > 0) {
                    const depositMonth = tenantData.contractStart
                        ? tenantData.contractStart.slice(0, 7)
                        : getMonthStr(new Date());
                    appData.rents.push({
                        id: Date.now().toString() + '_deposit',
                        type: 'deposit',
                        tenantId: tenantData.id,
                        roomId: tenantData.roomId,
                        buildingId: tenantData.buildingId,
                        month: depositMonth,
                        amount: tenantData.deposit,
                        rentAmount: tenantData.deposit,
                        managementFee: 0,
                        paidDate: null,
                        status: 'pending',
                        memo: 'ë³´ì¦ê¸ˆ'
                    });
                }
            }
            saveData();
            closeModal('addTenantModal');
            renderTenants();
            showToast(editingId ? 'ì„¸ìž…ìžê°€ ìˆ˜ì •ë˜ì—ˆìŠµë‹ˆë‹¤' : 'ì„¸ìž…ìžê°€ ì¶”ê°€ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function editTenant(id) {
            const tenant = appData.tenants.find(t => t.id === id);
            if (!tenant) { showToast('âš ï¸ ì„¸ìž…ìž ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            openModal('addTenantModal');
            editingId = id;
            loadAllRooms();
            document.getElementById('tenantRoom').value = tenant.roomId;
            document.getElementById('tenantRentType').value = tenant.rentType || 'monthly';
            toggleRentTypeFields();
            document.getElementById('tenantName').value = tenant.name;
            const _ridEl = document.getElementById('tenantResidentId');
            _ridEl.value = tenant.residentId || '';
            formatResidentId(_ridEl);
            document.getElementById('tenantPhone').value = tenant.phone;
            document.getElementById('tenantBirthday').value = tenant.birthday || '';
            document.getElementById('tenantOccupation').value = tenant.occupation || '';
            document.getElementById('tenantEmail').value = tenant.email || '';
            document.getElementById('tenantContractStart').value = tenant.contractStart;
            document.getElementById('tenantContractEnd').value = tenant.contractEnd;
            document.getElementById('tenantRent').value = tenant.monthlyRent;
            document.getElementById('tenantManagementFee').value = tenant.managementFee || 0;
            document.getElementById('tenantDeposit').value = tenant.deposit;
            document.getElementById('tenantCleaningFee').value = tenant.cleaningFee || 0;
            document.getElementById('tenantPayDay').value = tenant.payDay;
            document.getElementById('tenantMoveInDate').value = tenant.moveInDate;
            document.getElementById('tenantMemo').value = tenant.memo;
            document.getElementById('tenantEmergencyName').value = tenant.emergencyName || '';
            document.getElementById('tenantEmergencyPhone').value = tenant.emergencyPhone || '';
            document.getElementById('tenantGuarantorName').value = tenant.guarantorName || '';
            document.getElementById('tenantGuarantorPhone').value = tenant.guarantorPhone || '';
            document.getElementById('tenantGuarantorRelation').value = tenant.guarantorRelation || '';
            // ì¶”ê°€ ì •ë³´ê°€ ìž…ë ¥ëœ ê²½ìš° ì„¹ì…˜ ìžë™ íŽ¼ì¹¨
            var extraSec = document.querySelector('#addTenantModal .tenant-extra-section');
            if (extraSec && (tenant.emergencyName || tenant.emergencyPhone || tenant.guarantorName || tenant.guarantorPhone)) {
                extraSec.open = true;
            } else if (extraSec) {
                extraSec.open = false;
            }
            document.getElementById('tenantModalTitle').textContent = 'ì„¸ìž…ìž ìˆ˜ì •';
            document.getElementById('deleteTenantBtn').style.display = 'block';
        }
        function deleteTenant() {
            const _tid = editingId;
            showConfirm('ì„¸ìž…ìžë¥¼ ì‚­ì œí•˜ë©´ ê´€ë ¨ ìˆ˜ë‚© ê¸°ë¡ë„ ëª¨ë‘ ì‚­ì œë©ë‹ˆë‹¤.\nì •ë§ ì‚­ì œí•˜ì‹œê² ìŠµë‹ˆê¹Œ?', function() {
                const tenant = appData.tenants.find(t => t.id === _tid);
                if (!tenant) { showToast('ì˜¤ë¥˜: ì„¸ìž…ìžë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
                const roomId = tenant.roomId;
                appData.tenants = appData.tenants.filter(t => t.id !== _tid);
                appData.rents = appData.rents.filter(r => r.tenantId !== _tid);
                const stillOccupied = appData.tenants.some(t => t.roomId === roomId && t.status === 'active');
                if (!stillOccupied) {
                    const room = appData.rooms.find(r => r.id === roomId);
                    if (room) room.status = 'vacant';
                }
                saveData();
                closeModal('addTenantModal');
                renderTenants();
                renderDashboard();
                showToast('ì„¸ìž…ìžê°€ ì‚­ì œë˜ì—ˆìŠµë‹ˆë‹¤');
            });
        }
        function _calcAge(birthday) {
            if (!birthday) return null;
            var today = new Date();
            var bd = new Date(birthday);
            var age = today.getFullYear() - bd.getFullYear();
            var m = today.getMonth() - bd.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
            return age;
        }
        function _fmtDate(d) {
            if (!d) return '-';
            return d.replace(/-/g, '.'); // YYYY-MM-DD â†’ YYYY.MM.DD
        }
        function _contractDur(s, e) {
            if (!s || !e) return '';
            var ms = new Date(e) - new Date(s);
            var months = Math.round(ms / (1000*60*60*24*30.44));
            var y = Math.floor(months/12); var m = months%12;
            return (y>0?y+'ë…„ ':'') + m+'ê°œì›”';
        }
        function renderTenants() {
            var container = document.getElementById('tenantsList');
            var searchText = (document.getElementById('tenantSearch') ? document.getElementById('tenantSearch').value : '').toLowerCase();
            container.innerHTML = '';
            var _td = new Date().toISOString().split('T')[0];
            var allTenants = (appData.tenants || []).filter(function(t) {
                return t.status === 'active' && (!t.contractEnd || t.contractEnd >= _td);
            });
            if (searchText) {
                allTenants = allTenants.filter(function(t) {
                    var room = appData.rooms.find(function(r) { return r.id === t.roomId; });
                    return t.name.toLowerCase().includes(searchText) ||
                           (room ? room.roomNumber : '').toLowerCase().includes(searchText);
                });
            }
            if (allTenants.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ‘¥</div><p>í˜„ìž¬ ì„¸ìž…ìžê°€ ì—†ìŠµë‹ˆë‹¤</p><button class="btn btn-primary" style="margin-top:16px;" onclick="openModal(\'addTenantModal\')">+ ì„¸ìž…ìž ì¶”ê°€</button></div>';
                return;
            }
            var _sortSel = document.getElementById('tenantSortSel');
            var _sortMode = _sortSel ? _sortSel.value : 'name';
            allTenants.sort(function(a, b) {
                if (_sortMode === 'rent_desc') return ((b.monthlyRent||0)+(b.managementFee||0)) - ((a.monthlyRent||0)+(a.managementFee||0));
                if (_sortMode === 'rent_asc')  return ((a.monthlyRent||0)+(a.managementFee||0)) - ((b.monthlyRent||0)+(b.managementFee||0));
                if (_sortMode === 'end_asc') {
                    var ea = a.contractEnd || '9999-99', eb = b.contractEnd || '9999-99';
                    return ea.localeCompare(eb);
                }
                // ê¸°ë³¸: ê±´ë¬¼ëª… â†’ í˜¸ìˆ˜ìˆœ
                var bA = (appData.buildings.find(function(x){return x.id===a.buildingId;})||{}).name||'';
                var bB = (appData.buildings.find(function(x){return x.id===b.buildingId;})||{}).name||'';
                if (bA !== bB) return bA.localeCompare(bB);
                var rA = (appData.rooms.find(function(x){return x.id===a.roomId;})||{}).roomNumber||'';
                var rB = (appData.rooms.find(function(x){return x.id===b.roomId;})||{}).roomNumber||'';
                return rA.localeCompare(rB, undefined, {numeric:true});
            });
            allTenants.forEach(function(tenant) {
                var building = appData.buildings.find(function(b){return b.id===tenant.buildingId;});
                var room = appData.rooms.find(function(r){return r.id===tenant.roomId;});
                var bName = building ? building.name : 'ë¯¸ì§€ì •';
                var rNum = room ? room.roomNumber : '?';
                var today = new Date();
                var endDate = new Date(tenant.contractEnd);
                var daysLeft = Math.floor((endDate - today) / 86400000);
                var badgeText, badgeBg, badgeColor;
                if (daysLeft < 0)      { badgeText='ê³„ì•½ë§Œë£Œ'; badgeBg='#FEE2E2'; badgeColor='#DC2626'; }
                else if (daysLeft < 30){ badgeText='D-'+daysLeft; badgeBg='#FEF3C7'; badgeColor='#D97706'; }
                else                   { badgeText='ìž…ì£¼ì¤‘'; badgeBg='#DCFCE7'; badgeColor='#16A34A'; }
                var safeTenantName = escapeHTML(tenant.name || '');
                var safePhone = escapeHTML(tenant.phone || '');
                var safeOccupation = escapeHTML(tenant.occupation || '');
                var safeMemo = escapeHTML(tenant.memo || '');
                var safeBuildingRoom = escapeHTML(bName + ' ' + rNum + 'í˜¸');
                var rentAmt = (tenant.monthlyRent||0)+(tenant.managementFee||0);
                var rentLabel = tenant.rentType==='annual' ? 'ì—°ì„¸' : (tenant.managementFee>0 ? 'ì›”ì„¸ + ê´€ë¦¬ë¹„' : 'ì›”ì„¸');
                var cStart = _fmtDate(tenant.contractStart);
                var cEnd = _fmtDate(tenant.contractEnd);
                var dur = _contractDur(tenant.contractStart, tenant.contractEnd);
                var contractStr = cStart + ' ~ ' + cEnd + (dur ? ' (' + dur + ')' : '');
                var age = _calcAge(tenant.birthday);
                var bdStr = tenant.birthday ? _fmtDate(tenant.birthday) + (age!==null ? ' (ë§Œ '+age+'ì„¸)' : '') : '';
                var tid = tenant.id;
                var card = document.createElement('div');
                card.className = 'tc-card';
                // Header
                var html = '<div class="tc-card-header">' +
                    '<div class="tc-header-left"><span class="tc-header-icon">ðŸ¢</span>' +
                    '<span class="tc-header-building">' + safeBuildingRoom + '</span></div>' +
                    '<span class="tc-status-badge" style="background:'+badgeBg+';color:'+badgeColor+';">'+badgeText+'</span>' +
                    '</div>';
                // Body
                html += '<div class="tc-card-body">' +
                    '<div class="tc-avatar">' + safeInitial(tenant.name) + '</div>' +
                    '<div class="tc-info">' +
                        '<div class="tc-name">' + safeTenantName + '</div>' +
                        (tenant.phone ? '<div class="tc-detail"><span style="font-size:13px;">ðŸ“±</span>' + safePhone + '</div>' : '') +
                        '<div class="tc-detail"><span style="font-size:13px;">ðŸ“…</span>' + escapeHTML(contractStr) + '</div>' +
                    '</div>' +
                    '<div class="tc-rent-col">' +
                        '<div class="tc-rent-label">' + escapeHTML(rentLabel) + '</div>' +
                        '<div style="display:flex;align-items:center;gap:2px;">' +
                            '<div class="tc-rent-amount">â‚©' + rentAmt.toLocaleString() + '</div>' +
                            '<span class="tc-rent-chevron">â€º</span>' +
                        '</div>' +
                    '</div>' +
                    '</div>';
                // ìƒë…„ì›”ì¼ + ì§ì—… í–‰ (ë‘˜ ì¤‘ í•˜ë‚˜ë¼ë„ ìžˆìœ¼ë©´ í‘œì‹œ)
                if (bdStr || tenant.occupation) {
                    html += '<div class="tc-meta-row">' +
                        '<div class="tc-meta-cell"><span style="font-size:13px;">ðŸ‘¤</span>' + escapeHTML(bdStr||'-') + '</div>' +
                        '<div class="tc-meta-divider"></div>' +
                        '<div class="tc-meta-cell"><span style="font-size:13px;">ðŸ“‹</span>' + (safeOccupation||'-') + '</div>' +
                        '</div>';
                }
                // ë©”ëª¨ í–‰ (í•­ìƒ í‘œì‹œ)
                html += '<div class="tc-memo-row"><span style="font-size:13px;flex-shrink:0;">ðŸ“</span>' +
                    '<span style="color:'+(tenant.memo?'#374151':'#94A3B8')+';">' + (safeMemo||'ë©”ëª¨ ì—†ìŒ') + '</span>' +
                    '</div>';
                // ë²„íŠ¼
                html += '<div class="tc-actions">' +
                    '<button class="tc-btn-outline" data-action="renew">ê³„ì•½ ê°±ì‹ </button>' +
                    '<button class="tc-btn-fill" data-action="detail">ìƒì„¸ë³´ê¸°</button>' +
                    '</div>';
                card.innerHTML = html;
                card.querySelector('[data-action="renew"]').addEventListener('click', function(e){e.stopPropagation();openRenewModal(tid);});
                card.querySelector('[data-action="detail"]').addEventListener('click', function(e){e.stopPropagation();showTenantDetail(tid);});
                container.appendChild(card);
            });
        }
        function refundDeposit(tenantId) {
            refundDepositModal(tenantId);
        }
        function addCleaningFeeRecord(tenantId) {
            const tenant = appData.tenants.find(t => t.id === tenantId);
            if (!tenant || tenant.cleaningFee <= 0) {
                showToast('ì²­ì†Œë¹„ê°€ ì„¤ì •ë˜ì§€ ì•Šì•˜ìŠµë‹ˆë‹¤');
                return;
            }
            const already = appData.rents.find(r => r.tenantId === tenantId && r.type === 'cleaning');
            if (already) {
                showToast('ì´ë¯¸ ì²­ì†Œë¹„ ê¸°ë¡ì´ ìžˆìŠµë‹ˆë‹¤');
                return;
            }
            appData.rents.push({
                id: Date.now().toString() + '_cleaning',
                type: 'cleaning',
                tenantId: tenant.id,
                roomId: tenant.roomId,
                buildingId: tenant.buildingId,
                month: getMonthStr(new Date()),
                amount: tenant.cleaningFee,
                rentAmount: tenant.cleaningFee,
                managementFee: 0,
                paidDate: null,
                status: 'pending',
                memo: 'ì²­ì†Œë¹„'
            });
            saveData();
            renderDashboard();
            showTenantDetail(tenantId);
            showToast('ì²­ì†Œë¹„ ìˆ˜ë‚© ê¸°ë¡ì´ ì¶”ê°€ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        var _currentDetailTenantId = null;
        function editCurrentTenant() {
            if (_currentDetailTenantId) { editTenant(_currentDetailTenantId); }
        }
        function showTenantDetail(tenantId) {
            const tenant = appData.tenants.find(function(t) { return t.id === tenantId; });
            if (!tenant) { showToast('âš ï¸ ì„¸ìž…ìž ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            _currentDetailTenantId = tenantId;
            const room = appData.rooms.find(function(r) { return r.id === tenant.roomId; });
            const building = appData.buildings.find(function(b) { return b.id === tenant.buildingId; });
            const bName = building ? building.name : 'ë¯¸ì§€ì •';
            const rNum = room ? room.roomNumber : '?';

            // Status badge
            const today = new Date();
            const _td = today.toISOString().split('T')[0];
            const endDate = new Date(tenant.contractEnd || _td);
            const daysLeft = Math.floor((endDate - today) / 86400000);
            const isActive = tenant.status === 'active';
            let badgeText, badgeBg, badgeColor;
            if (!isActive) { badgeText='í‡´ê±°'; badgeBg='#F1F5F9'; badgeColor='#6B7280'; }
            else if (daysLeft < 0) { badgeText='ê³„ì•½ë§Œë£Œ'; badgeBg='#FEE2E2'; badgeColor='#DC2626'; }
            else if (daysLeft < 30) { badgeText='D-'+daysLeft; badgeBg='#FEF3C7'; badgeColor='#D97706'; }
            else { badgeText='ìž…ì£¼ì¤‘'; badgeBg='#DCFCE7'; badgeColor='#16A34A'; }

            // Rent info
            const totalRent = (tenant.monthlyRent||0) + (tenant.managementFee||0);
            const rentLabel = tenant.rentType==='annual' ? 'ì—°ì„¸' : (tenant.managementFee>0 ? 'ì›”ì„¸+ê´€ë¦¬ë¹„' : 'ì›”ì„¸');
            const safeTenantName = escapeHTML(tenant.name || '');
            const safeBName = escapeHTML(bName);
            const safeRNum = escapeHTML(rNum);
            const safePhone = escapeHTML(tenant.phone || '');
            const safeEmail = escapeHTML(tenant.email || '');
            const safeOccupation = escapeHTML(tenant.occupation || '');
            const safeMemo = escapeHTML(tenant.memo || '');
            const telHref = safePhoneHref(tenant.phone, 'tel');
            const smsHref = safePhoneHref(tenant.phone, 'sms');

            // Contract duration
            function contractDuration(s, e) {
                if (!s || !e) return '';
                const ms = new Date(e) - new Date(s);
                const months = Math.round(ms / (1000*60*60*24*30.44));
                const y = Math.floor(months/12); const m = months%12;
                return (y>0 ? y+'ë…„ ' : '') + (m>0 ? m+'ê°œì›”' : '');
            }
            const dur = contractDuration(tenant.contractStart, tenant.contractEnd);
            const cPeriod = (tenant.contractStart||'-') + ' ~ ' + (tenant.contractEnd||'-') + (dur ? ' ('+dur+')' : '');

            // Payment info
            const tenantRents = (appData.rents||[]).filter(function(r) { return r.tenantId===tenantId; })
                .sort(function(a,b) { return b.month.localeCompare(a.month); });
            const curMonth = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0');
            const thisMonthRent = tenantRents.find(function(r) { return r.month===curMonth && (!r.type||r.type==='monthly'); });
            const unpaidRents = tenantRents.filter(function(r) { return (r.status==='pending'||r.status==='overdue') && (!r.type||r.type==='monthly') && r.month<=curMonth; });
            const hasCleaningRecord = tenantRents.some(function(r) { return r.type==='cleaning'; });

            // â”€â”€â”€ Hero card â”€â”€â”€
            let html = '<div class="td-hero-card">';
            html += '<div class="td-hero-top">';
            html += '<div class="td-hero-building">ðŸ¢ '+safeBName+' '+safeRNum+'í˜¸</div>';
            html += '<span class="td-hero-badge" style="background:'+badgeBg+';color:'+badgeColor+';">'+badgeText+'</span>';
            html += '</div>';
            html += '<div class="td-hero-main">';
            html += '<div class="td-avatar">'+safeInitial(tenant.name)+'</div>';
            html += '<div class="td-hero-info">';
            html += '<div class="td-hero-name">'+safeTenantName+'</div>';
            if (tenant.phone) html += '<div class="td-hero-contact"><span>ðŸ“±</span>'+safePhone+'</div>';
            if (tenant.email) html += '<div class="td-hero-contact"><span>âœ‰ï¸</span><a href="mailto:'+safeEmail+'" style="color:inherit;text-decoration:none;">'+safeEmail+'</a></div>';
            if (tenant.birthday) { var _age=_calcAge(tenant.birthday); html += '<div class="td-hero-contact"><span>ðŸ‘¤</span>'+_fmtDate(tenant.birthday)+(_age!==null?' (ë§Œ '+_age+'ì„¸)':'')+'</div>'; }
            if (tenant.occupation) html += '<div class="td-hero-contact"><span>ðŸ“‹</span>'+safeOccupation+'</div>';
            html += '</div>';
            html += '<div class="td-hero-rent-col">';
            html += '<div class="td-hero-rent-label">'+rentLabel+'</div>';
            html += '<div class="td-hero-rent-amount">â‚©'+totalRent.toLocaleString()+'</div>';
            html += '</div></div>';
            // info rows
            html += '<div class="td-hero-rows">';
            html += '<div class="td-hero-row"><span class="td-hero-row-label">ðŸ“… ê³„ì•½ê¸°ê°„</span><span class="td-hero-row-value">'+cPeriod+'</span></div>';
            if (tenant.moveInDate) html += '<div class="td-hero-row"><span class="td-hero-row-label">ðŸ  ìž…ì£¼ì¼</span><span class="td-hero-row-value">'+tenant.moveInDate+'</span></div>';
            if (tenant.payDay) html += '<div class="td-hero-row"><span class="td-hero-row-label">ðŸ’³ ë‚©ë¶€ì¼</span><span class="td-hero-row-value">ë§¤ì›” '+tenant.payDay+'ì¼</span></div>';
            html += '<div class="td-hero-row"><span class="td-hero-row-label">ðŸ“ ë©”ëª¨</span><span class="td-hero-row-value">'+(safeMemo||'ì—†ìŒ')+'</span></div>';
            html += '</div>';
            // action buttons
            html += '<div class="td-hero-btns">';
            if (tenant.phone) {
                html += '<button class="td-hero-btn-outline" onclick="window.location.href=\''+telHref+'\'">ðŸ“ž ì „í™”í•˜ê¸°</button>';
                html += '<button class="td-hero-btn-fill" onclick="window.location.href=\''+smsHref+'\'">ðŸ’¬ ë¬¸ìží•˜ê¸°</button>';
            } else {
                html += '<button class="td-hero-btn-outline" onclick="editCurrentTenant()">âœï¸ ì •ë³´ ìˆ˜ì •</button>';
            }
            html += '</div></div>';

            // â”€â”€â”€ ë‚©ë¶€ ì •ë³´ â”€â”€â”€
            html += '<div class="td-section"><div class="td-section-title">ë‚©ë¶€ ì •ë³´</div>';
            html += '<div class="td-section-card">';
            html += '<div class="td-amount-pair">';
            html += '<div class="td-amount-cell"><div class="td-amount-cell-label">ë³´ì¦ê¸ˆ</div><div class="td-amount-cell-value">â‚©'+(tenant.deposit||0).toLocaleString()+'</div></div>';
            html += '<div class="td-amount-cell"><div class="td-amount-cell-label">'+rentLabel+'</div><div class="td-amount-cell-value" style="color:#2563EB;">â‚©'+totalRent.toLocaleString()+'</div></div>';
            html += '</div>';
            // This month status
            if (thisMonthRent) {
                const isPaid = thisMonthRent.status==='paid';
                const isPartial = thisMonthRent.status==='partial';
                const statusClass = isPaid ? 'td-pay-ok' : (isPartial ? 'td-pay-none' : 'td-pay-fail');
                const statusIcon = isPaid ? 'âœ…' : (isPartial ? 'âš ï¸' : 'âŒ');
                const paidInfo = isPaid ? (thisMonthRent.paidDate||'') : (isPartial ? 'ë¶€ë¶„ë‚©ë¶€' : 'ë¯¸ë‚©');
                html += '<div class="td-pay-status-row '+statusClass+'">';
                html += '<span>'+statusIcon+' '+curMonth.replace('-','ë…„ ')+'ì›” '+(isPaid?'ë‚©ë¶€ ì™„ë£Œ':isPartial?'ë¶€ë¶„ ë‚©ë¶€':'ë¯¸ë‚©')+'</span>';
                html += '<span>'+paidInfo+'</span></div>';
                // ë¶€ë¶„ë‚©ë¶€ ì‹œ ë°›ì€ ê¸ˆì•¡Â·ìž”ì•¡ ëª…ì‹œ
                if (isPartial) {
                    const _expected = (thisMonthRent.rentAmount||0) + (thisMonthRent.managementFee||0);
                    const _balance = Math.max(0, _expected - (thisMonthRent.amount||0));
                    html += '<div style="padding:6px 12px 8px;background:#FFFBEB;border-radius:8px;margin:0 10px 8px;font-size:12px;">';
                    html += '<div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#92400E;">ë°›ì€ ê¸ˆì•¡</span><span style="font-weight:700;color:#1E293B;">â‚©'+(thisMonthRent.amount||0).toLocaleString()+'</span></div>';
                    html += '<div style="display:flex;justify-content:space-between;"><span style="color:#92400E;">ë¯¸ìˆ˜ ìž”ì•¡</span><span style="font-weight:700;color:#DC2626;">â‚©'+_balance.toLocaleString()+'</span></div>';
                    html += '</div>';
                }
                if (thisMonthRent.status !== 'paid') {
                    html += '<div style="padding:0 10px 8px;"><button class="td-bottom-btn-fill" style="width:100%;padding:9px;" onclick="markRentPaid(\''+thisMonthRent.id+'\')">ðŸ’° ìˆ˜ë‚© ì²˜ë¦¬</button></div>';
                }
            } else {
                html += '<div class="td-pay-status-row td-pay-none"><span>ðŸ“‹ '+curMonth.replace('-','ë…„ ')+'ì›” ê¸°ë¡ ì—†ìŒ</span><span></span></div>';
            }
            // Unpaid count
            html += '<div class="td-info-row"><span class="td-info-label">ë¯¸ë‚© ë‚´ì—­</span><span class="td-info-value" style="'+(unpaidRents.length>0?'color:#DC2626;':'color:#16A34A;')+'">'+(unpaidRents.length>0?unpaidRents.length+'ê±´':'ì—†ìŒ')+'</span></div>';
            // Full history button
            html += '<button class="td-rent-history-btn" onclick="_toggleRentHistory(\''+tenantId+'\')">ì „ì²´ ìˆ˜ë‚© ë‚´ì—­ ë³´ê¸° <span>â€º</span></button>';
            html += '</div></div>';

            // â”€â”€â”€ ìˆ˜ë‚© ë‚´ì—­ (collapsed) â”€â”€â”€
            html += '<div id="tdRentHistory" style="display:none;">';
            html += '<div class="td-section"><div class="td-section-title">ìˆ˜ë‚© ë‚´ì—­</div>';
            html += '<div class="td-section-card">';
            const monthlyRents = tenantRents.filter(function(r) { return !r.type||r.type==='monthly'; }).slice(0,24);
            if (monthlyRents.length===0) {
                html += '<div style="padding:16px;text-align:center;color:#94A3B8;font-size:13px;">ìˆ˜ë‚© ë‚´ì—­ì´ ì—†ìŠµë‹ˆë‹¤</div>';
            } else {
                monthlyRents.forEach(function(rent) {
                    const badgeCls = rent.status==='paid'?'td-badge-ok':rent.status==='partial'?'td-badge-partial':'td-badge-fail';
                    const badgeTxt = rent.status==='paid'?'ì™„ë‚©':rent.status==='partial'?'ë¶€ë¶„ë‚©ë¶€':'ë¯¸ë‚©';
                    const expected = (rent.rentAmount||0) + (rent.managementFee||0);
                    const balance = rent.status === 'partial' ? Math.max(0, expected - (rent.amount||0)) : 0;
                    html += '<div class="td-rent-item" style="cursor:pointer;" onclick="markRentPaid(\''+rent.id+'\')">';
                    html += '<div><div class="td-rent-item-label">'+rent.month+'</div>';
                    if (rent.managementFee>0) html += '<div class="td-rent-item-sub">ì›”ì„¸ â‚©'+(rent.rentAmount||0).toLocaleString()+' + ê´€ë¦¬ë¹„ â‚©'+rent.managementFee.toLocaleString()+'</div>';
                    if (balance > 0) html += '<div class="td-rent-item-sub" style="color:#DC2626;font-weight:700;">ìž”ì•¡ â‚©'+balance.toLocaleString()+'</div>';
                    html += '<span class="'+badgeCls+'">'+badgeTxt+'</span></div>';
                    html += '<div class="td-rent-item-right"><div class="td-rent-item-amount">â‚©'+rent.amount.toLocaleString()+'</div>';
                    if (rent.paidDate) html += '<div class="td-rent-item-sub">'+rent.paidDate+'</div>';
                    html += '</div></div>';
                });
            }
            html += '</div></div></div>';

            // â”€â”€â”€ ê³„ì•½ ì •ë³´ â”€â”€â”€
            html += '<div class="td-section"><div class="td-section-title">ê³„ì•½ ì •ë³´</div>';
            html += '<div class="td-section-card">';
            html += '<div class="td-info-row"><span class="td-info-label">ðŸ“… ê³„ì•½ ê¸°ê°„</span><span class="td-info-value">'+cPeriod+'</span></div>';
            html += '<div class="td-info-row"><span class="td-info-label">ðŸ¦ ë³´ì¦ê¸ˆ</span><span class="td-info-value">â‚©'+(tenant.deposit||0).toLocaleString()+'</span></div>';
            html += '<div class="td-info-row"><span class="td-info-label">ðŸ’° ì›”ì„¸</span><span class="td-info-value">â‚©'+(tenant.monthlyRent||0).toLocaleString()+(tenant.rentType==='annual'?' (ì—° 1íšŒ)':'')+'</span></div>';
            if (tenant.managementFee>0) html += '<div class="td-info-row"><span class="td-info-label">ðŸ  ê´€ë¦¬ë¹„</span><span class="td-info-value">â‚©'+(tenant.managementFee||0).toLocaleString()+'</span></div>';
            if ((tenant.cleaningFee||0)>0) html += '<div class="td-info-row"><span class="td-info-label">ðŸ§¹ ì²­ì†Œë¹„</span><span class="td-info-value">â‚©'+(tenant.cleaningFee||0).toLocaleString()+'</span></div>';
            if (tenant.residentId) html += '<div class="td-info-row"><span class="td-info-label">ðŸªª ì£¼ë¯¼ë²ˆí˜¸</span><span class="td-info-value">'+escapeHTML(tenant.residentId)+'</span></div>';
            if (tenant.depositRefunded) {
                html += '<div class="td-deposit-ok">âœ… ë³´ì¦ê¸ˆ ë°˜í™˜ ì™„ë£Œ '+escapeHTML('('+(tenant.depositRefundDate||'ë‚ ì§œ ë¯¸ê¸°ë¡')+')')+'</div>';
            }
            html += '</div></div>';

            // â”€â”€â”€ ìž„ëŒ€ë£Œ ë³€ê²½ ì´ë ¥ â”€â”€â”€
            if (tenant.rentHistory && tenant.rentHistory.length > 0) {
                html += '<div class="td-section"><div class="td-section-title">ìž„ëŒ€ë£Œ ë³€ê²½ ì´ë ¥</div>';
                html += '<div class="td-section-card">';
                // ìµœì‹ ìˆœ ì •ë ¬
                const _hist = tenant.rentHistory.slice().sort(function(a,b){ return (b.to||'').localeCompare(a.to||''); });
                // í˜„ìž¬ ê³„ì•½ (í—¤ë” í–‰)
                html += '<div class="td-info-row" style="background:#EFF6FF;border-radius:6px;padding:8px 10px;margin-bottom:6px;">'
                     + '<span class="td-info-label">í˜„ìž¬ (' + escapeHTML(tenant.contractStart || '') + '~)</span>'
                     + '<span class="td-info-value" style="color:#2563EB;font-weight:800;">â‚©' + ((tenant.monthlyRent||0) + (tenant.managementFee||0)).toLocaleString() + '</span>'
                     + '</div>';
                _hist.forEach(function(h) {
                    const totalH = (h.monthlyRent||0) + (h.managementFee||0);
                    const periodH = (h.from ? _fmtDate(h.from) : '?') + ' ~ ' + (h.to ? _fmtDate(h.to) : '?');
                    const reasonTxt = h.reason === 'renew' ? 'ê°±ì‹ ' : 'ìˆ˜ì •';
                    html += '<div class="td-info-row"><span class="td-info-label" style="font-size:12px;">' + periodH + ' <span style="color:#94A3B8;font-size:11px;">(' + reasonTxt + ')</span></span>'
                         + '<span class="td-info-value">â‚©' + totalH.toLocaleString() + '</span></div>';
                });
                html += '</div></div>';
            }

            // â”€â”€â”€ ë¹„ìƒì—°ë½ì²˜ Â· ë³´ì¦ì¸ â”€â”€â”€
            const hasEmergency = tenant.emergencyName || tenant.emergencyPhone;
            const hasGuarantor = tenant.guarantorName || tenant.guarantorPhone;
            if (hasEmergency || hasGuarantor) {
                html += '<div class="td-section"><div class="td-section-title">ë¹„ìƒì—°ë½ì²˜ Â· ë³´ì¦ì¸</div>';
                html += '<div class="td-section-card">';
                if (hasEmergency) {
                    const epName = escapeHTML(tenant.emergencyName || 'ë¹„ìƒì—°ë½ì²˜');
                    const epPhone = escapeHTML(tenant.emergencyPhone || '');
                    const epHref = safePhoneHref(tenant.emergencyPhone, 'tel');
                    html += '<div class="td-info-row"><span class="td-info-label">ðŸ“ž '+epName+'</span>';
                    if (epPhone) {
                        html += '<a href="'+epHref+'" class="td-info-value" style="color:#2563EB;text-decoration:none;">'+epPhone+'</a>';
                    } else {
                        html += '<span class="td-info-value">-</span>';
                    }
                    html += '</div>';
                }
                if (hasGuarantor) {
                    const gName = escapeHTML(tenant.guarantorName || 'ë³´ì¦ì¸');
                    const gPhone = escapeHTML(tenant.guarantorPhone || '');
                    const gRel = tenant.guarantorRelation ? ' ('+escapeHTML(tenant.guarantorRelation)+')' : '';
                    const gHref = safePhoneHref(tenant.guarantorPhone, 'tel');
                    html += '<div class="td-info-row"><span class="td-info-label">ðŸ›¡ï¸ '+gName+gRel+'</span>';
                    if (gPhone) {
                        html += '<a href="'+gHref+'" class="td-info-value" style="color:#2563EB;text-decoration:none;">'+gPhone+'</a>';
                    } else {
                        html += '<span class="td-info-value">-</span>';
                    }
                    html += '</div>';
                }
                html += '</div></div>';
            }

            // â”€â”€â”€ Cleaning fee / deposit actions (non-active tenants) â”€â”€â”€
            if (!isActive && !hasCleaningRecord && (tenant.cleaningFee||0)>0) {
                html += '<div class="td-section">';
                html += '<button class="td-bottom-btn-outline" style="width:100%;padding:13px;" onclick="addCleaningFeeRecord(\''+tenantId+'\')">ðŸ§¹ ì²­ì†Œë¹„ ìˆ˜ë‚© ë“±ë¡</button>';
                html += '</div>';
            }

            // Bottom padding
            html += '<div style="height:80px;"></div>';

            // â”€â”€â”€ Bottom action bar â”€â”€â”€
            const bottomBar = document.getElementById('tdBottomBar');
            bottomBar.style.display = 'flex';
            bottomBar.innerHTML = '';
            if (isActive) {
                if (tenant.deposit>0 && !tenant.depositRefunded) {
                    const refundBtn = document.createElement('button');
                    refundBtn.className='td-bottom-btn-danger';
                    refundBtn.textContent='ðŸ¦ ë³´ì¦ê¸ˆ ë°˜í™˜';
                    refundBtn.onclick=function() { refundDeposit(tenantId); };
                    bottomBar.appendChild(refundBtn);
                }
                const renewBtn = document.createElement('button');
                renewBtn.className='td-bottom-btn-outline';
                renewBtn.textContent='ðŸ“‹ ê³„ì•½ ê°±ì‹ ';
                renewBtn.onclick=function() { openRenewModal(tenantId); };
                bottomBar.appendChild(renewBtn);
            } else {
                if (tenant.deposit>0 && !tenant.depositRefunded) {
                    const refundBtn = document.createElement('button');
                    refundBtn.className='td-bottom-btn-danger';
                    refundBtn.textContent='ðŸ¦ ë³´ì¦ê¸ˆ ë°˜í™˜';
                    refundBtn.onclick=function() { refundDeposit(tenantId); };
                    bottomBar.appendChild(refundBtn);
                }
            }

            const contentEl = document.getElementById('tenantDetailContent');
            contentEl.innerHTML = html;
            contentEl.scrollTop = 0;
            // Re-attach rent click handlers (event delegation safe)
            openModal('tenantDetailModal');
        }
        function _toggleRentHistory(tenantId) {
            const el = document.getElementById('tdRentHistory');
            if (!el) return;
            const btn = document.querySelector('.td-rent-history-btn');
            const isOpen = el.style.display !== 'none';
            el.style.display = isOpen ? 'none' : 'block';
            if (btn) {
                btn.innerHTML = isOpen ? 'ì „ì²´ ìˆ˜ë‚© ë‚´ì—­ ë³´ê¸° <span>â€º</span>' : 'ì ‘ê¸° <span>âˆ§</span>';
                btn.classList.toggle('expanded', !isOpen);
            }
        }
        // ============ UTILS ============
        function escapeHTML(value) {
            return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[ch];
            });
        }
        function escapeAttr(value) {
            return escapeHTML(value).replace(/`/g, '&#96;');
        }
        function safeInitial(value) {
            var txt = String(value || '').trim();
            return txt ? escapeHTML(Array.from(txt)[0]) : '?';
        }
        function safePhoneHref(value, scheme) {
            var phone = String(value || '').replace(/[^0-9+*#-]/g, '');
            return scheme + ':' + encodeURIComponent(phone);
        }
        function getMonthStr(date) {
            return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        }
        function buildLookupMaps() {
            const tenantMap = {};
            const roomMap = {};
            const buildingMap = {};
            appData.tenants.forEach(t => { tenantMap[t.id] = t; });
            appData.rooms.forEach(r => { roomMap[r.id] = r; });
            appData.buildings.forEach(b => { buildingMap[b.id] = b; });
            return { tenantMap, roomMap, buildingMap };
        }
        // ============ RENTS ============
        let currentYear = new Date().getFullYear();
        let _rentBuildingFilter = null; // null = ì „ì²´

        function loadRentBuildingFilter() {
            const wrap = document.getElementById('rentBuildingFilter');
            if (!wrap) return;
            const buildings = appData.buildings || [];
            if (buildings.length <= 1) { wrap.style.display = 'none'; return; }
            wrap.style.display = 'flex';
            wrap.innerHTML = '';
            // ì „ì²´ ì¹©
            const allChip = document.createElement('button');
            allChip.className = 'rent-bld-chip' + (_rentBuildingFilter === null ? ' active' : '');
            allChip.textContent = 'ì „ì²´';
            allChip.onclick = function() { _rentBuildingFilter = null; loadRentBuildingFilter(); renderRents(); };
            wrap.appendChild(allChip);
            buildings.forEach(function(b) {
                const chip = document.createElement('button');
                chip.className = 'rent-bld-chip' + (_rentBuildingFilter === b.id ? ' active' : '');
                chip.textContent = b.name;
                chip.onclick = function() { _rentBuildingFilter = b.id; loadRentBuildingFilter(); renderRents(); };
                wrap.appendChild(chip);
            });
        }
        function isAfterContractEndMonth(tenant, month) {
            const tEnd = (tenant && tenant.contractEnd || '').slice(0, 7);
            return !!(tEnd && month > tEnd);
        }
        function previousYear() {
            currentYear--;
            document.getElementById('yearDisplay').textContent = currentYear + 'ë…„';
            renderRents();
        }
        function nextYear() {
            currentYear++;
            document.getElementById('yearDisplay').textContent = currentYear + 'ë…„';
            renderRents();
        }
        function createMonthlyRentRecord(tenant, month) {
            if (isAfterContractEndMonth(tenant, month)) return false;
            appData.rents.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'monthly',
                tenantId: tenant.id,
                roomId: tenant.roomId,
                buildingId: tenant.buildingId,
                month: month,
                amount: tenant.monthlyRent + (tenant.managementFee || 0),
                rentAmount: tenant.monthlyRent || 0,
                managementFee: tenant.managementFee || 0,
                paidDate: null,
                status: 'pending',
                memo: ''
            });
            return true;
        }
        let _generatingMonthlyRents = false;
        function generateAllMonthlyRents() {
            if (_generatingMonthlyRents) return;
            _generatingMonthlyRents = true;
            const month = getMonthStr(new Date());
            let created = 0;
            let skippedEnded = 0;
            appData.tenants.filter(t => t.status === 'active' && (t.rentType || 'monthly') === 'monthly').forEach(tenant => {
                // ìž…ì£¼ì¼ ì´ì „ ì›”ì€ ë ˆì½”ë“œ ìƒì„± ì•ˆ í•¨
                const _tmi = (tenant.moveInDate || '').slice(0,7);
                const _tcs = (tenant.contractStart || '').slice(0,7);
                const tStart = _tmi && _tcs ? (_tmi > _tcs ? _tmi : _tcs) : (_tmi || _tcs);
                if (tStart && month < tStart) return;
                if (isAfterContractEndMonth(tenant, month)) { skippedEnded++; return; }
                const exists = appData.rents.find(r => r.tenantId === tenant.id && r.month === month && (!r.type || r.type === 'monthly'));
                if (!exists && createMonthlyRentRecord(tenant, month)) { created++; }
            });
            if (created > 0) {
                saveData(); renderRents(); renderDashboard();
                showToast(`${created}ê±´ì˜ ì›”ì„¸ ê¸°ë¡ì´ ìƒì„±ë˜ì—ˆìŠµë‹ˆë‹¤`);
            } else if (skippedEnded > 0) {
                showToast('ê³„ì•½ ì¢…ë£Œì›” ì´í›„ ì„¸ìž…ìžëŠ” ì›”ì„¸ ê¸°ë¡ ìƒì„±ì—ì„œ ì œì™¸í–ˆìŠµë‹ˆë‹¤');
            } else {
                showToast('ì´ë¯¸ ìƒì„±ëœ ì›”ì„¸ ê¸°ë¡ì´ ìžˆìŠµë‹ˆë‹¤');
            }
            _generatingMonthlyRents = false;
        }
        let _markRentSourceTenantId = null;
        let _markRentOpening = false; // ì´ì¤‘ íƒ­ ë°©ì§€ í”Œëž˜ê·¸
        function markRentPaid(rentId) {
            if (_markRentOpening) return;
            _markRentOpening = true;
            setTimeout(() => { _markRentOpening = false; }, 600);
            const rent = appData.rents.find(r => r.id === rentId);
            if (!rent) { showToast('âš ï¸ ìˆ˜ë‚© ê¸°ë¡ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); _markRentOpening = false; return; }
            const tenant = appData.tenants.find(t => t.id === rent.tenantId);
            // ì„¸ìž…ìž ìƒì„¸ ëª¨ë‹¬ì—ì„œ ì—´ë ¸ëŠ”ì§€ ê¸°ë¡ (ì €ìž¥ í›„ ìž¬ì˜¤í”ˆ)
            const tenantModal = document.getElementById('tenantDetailModal');
            _markRentSourceTenantId = (tenantModal && tenantModal.classList.contains('active'))
                ? rent.tenantId : null;
            openModal('markRentModal');
            editingId = rentId;
            // ì²­êµ¬ ê¸ˆì•¡: rent.typeì´ deposit/cleaningì´ë©´ rent.amount ìžì²´ê°€ ì²­êµ¬, ì›”ì„¸ë©´ rentAmount+managementFee
            let expectedAmt;
            if (rent.type === 'monthly' || !rent.type) {
                expectedAmt = (rent.rentAmount != null ? rent.rentAmount : (tenant?.monthlyRent || 0))
                    + (rent.managementFee != null ? rent.managementFee : (tenant?.managementFee || 0));
            } else {
                // ë³´ì¦ê¸ˆÂ·ì²­ì†Œë¹„ ë“± ì¼ì‹œì„± í•­ëª©ì€ amount ìžì²´ê°€ ì²­êµ¬
                expectedAmt = rent.amount || 0;
            }
            document.getElementById('rentTenantName').value = tenant?.name || '';
            document.getElementById('rentAmount').value = rent.amount;
            document.getElementById('rentAmount').dataset.expected = expectedAmt;
            document.getElementById('rentPaidDate').value = rent.paidDate || new Date().toISOString().split('T')[0];
            document.getElementById('rentStatus').value = rent.status;
            document.getElementById('rentMemo').value = rent.memo || '';
            _updateRentBalanceUI();
        }
        // ì²­êµ¬ê¸ˆì•¡Â·ìž”ì•¡Â·ìƒíƒœì— ë”°ë¥¸ UI ë™ê¸°í™”
        function _updateRentBalanceUI() {
            const box = document.getElementById('rentExpectedBox');
            const amtEl = document.getElementById('rentAmount');
            const statusEl = document.getElementById('rentStatus');
            const labelEl = document.getElementById('rentAmountLabel');
            const hintEl = document.getElementById('rentPartialHint');
            const expectedAmtEl = document.getElementById('rentExpectedAmt');
            const balRow = document.getElementById('rentBalanceRow');
            const balAmtEl = document.getElementById('rentBalanceAmt');
            if (!box || !amtEl || !statusEl) return;
            const expected = parseInt(amtEl.dataset.expected) || 0;
            const paid = parseInt(amtEl.value) || 0;
            const status = statusEl.value;
            if (expected <= 0) { box.style.display = 'none'; hintEl.style.display = 'none'; return; }
            box.style.display = '';
            expectedAmtEl.textContent = 'â‚©' + expected.toLocaleString();
            if (status === 'partial') {
                labelEl.textContent = 'ë°›ì€ ê¸ˆì•¡ (ë¶€ë¶„ë‚©ë¶€)';
                hintEl.style.display = '';
                const balance = expected - paid;
                balRow.style.display = '';
                balAmtEl.textContent = 'â‚©' + Math.max(0, balance).toLocaleString();
                balAmtEl.style.color = balance > 0 ? '#DC2626' : '#16A34A';
            } else if (status === 'paid') {
                labelEl.textContent = 'ë‚©ë¶€ ê¸ˆì•¡';
                hintEl.style.display = 'none';
                balRow.style.display = 'none';
            } else { // pending
                labelEl.textContent = 'ì²­êµ¬ ê¸ˆì•¡';
                hintEl.style.display = 'none';
                balRow.style.display = '';
                balAmtEl.textContent = 'â‚©' + expected.toLocaleString();
                balAmtEl.style.color = '#DC2626';
            }
        }
        function markMonthCell(tenantId, month) {
            // ê¸°ë¡ ì—†ìœ¼ë©´ ìžë™ ìƒì„± í›„ ìˆ˜ë‚© ëª¨ë‹¬ ì—´ê¸°
            let rent = appData.rents.find(r => r.tenantId === tenantId && r.month === month && (!r.type || r.type === 'monthly'));
            if (!rent) {
                const tenant = appData.tenants.find(t => t.id === tenantId);
                if (!tenant) { showToast('âš ï¸ ì„¸ìž…ìž ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
                if (!createMonthlyRentRecord(tenant, month)) {
                    showToast('ê³„ì•½ ì¢…ë£Œì›” ì´í›„ì—ëŠ” ì›”ì„¸ ê¸°ë¡ì„ ìƒì„±í•  ìˆ˜ ì—†ìŠµë‹ˆë‹¤');
                    return;
                }
                saveData();
                rent = appData.rents.find(r => r.tenantId === tenantId && r.month === month && (!r.type || r.type === 'monthly'));
            }
            if (!rent) { showToast('âš ï¸ ìˆ˜ë‚© ê¸°ë¡ ìƒì„±ì— ì‹¤íŒ¨í–ˆìŠµë‹ˆë‹¤'); return; }
            markRentPaid(rent.id);
        }
        function saveRent(e) {
            e.preventDefault();
            const rent = appData.rents.find(r => r.id === editingId);
            if (!rent) { showToast('ì˜¤ë¥˜: ìˆ˜ë‚© ê¸°ë¡ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            const fromTenantId = _markRentSourceTenantId; // ì €ìž¥ ì „ì— ìº¡ì²˜
            const _rentAmt = parseInt(document.getElementById('rentAmount').value);
            if (isNaN(_rentAmt) || _rentAmt < 0) { showToast('âš ï¸ ì˜¬ë°”ë¥¸ ê¸ˆì•¡ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            rent.amount = _rentAmt;
            rent.paidDate = document.getElementById('rentPaidDate').value;
            rent.status = document.getElementById('rentStatus').value;
            rent.memo = document.getElementById('rentMemo').value;
            saveData();
            closeModal('markRentModal');
            // ì„¸ìž…ìž ìƒì„¸ì—ì„œ ì˜¨ ê²½ìš°: ì„¸ìž…ìž ìƒì„¸ ëª¨ë‹¬ ìž¬ì˜¤í”ˆ
            if (fromTenantId) {
                _markRentSourceTenantId = null;
                showTenantDetail(fromTenantId);
            }
            renderRents();
            renderTenants();
            renderDashboard();
            showToast('ìˆ˜ë‚© ê¸°ë¡ì´ ì €ìž¥ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function renderRentSummary(activeTenants, year) {
            const panel = document.getElementById('rentSummaryPanel');
            if (!panel) return;
            const yearPrefix = String(year) + '-';
            const tenantIds = new Set((activeTenants || []).map(t => t.id));
            const yearRents = (appData.rents || []).filter(r =>
                tenantIds.has(r.tenantId) &&
                r.month &&
                r.month.startsWith(yearPrefix) &&
                (!r.type || r.type === 'monthly')
            );
            const paidAmount = yearRents
                .filter(r => r.status === 'paid')
                .reduce((sum, r) => sum + (r.amount || 0), 0);
            const dueRents = yearRents.filter(r => r.status === 'pending' || r.status === 'overdue' || r.status === 'partial');
            // ë¯¸ìˆ˜ê¸ˆ = pending/overdueëŠ” ì²­êµ¬ê¸ˆì•¡ ì „ì²´, partialì€ ìž”ì•¡(ì²­êµ¬ - ë°›ì€ ê¸ˆì•¡)
            const dueAmount = dueRents.reduce((sum, r) => {
                const expected = (r.rentAmount || 0) + (r.managementFee || 0);
                if (r.status === 'partial') return sum + Math.max(0, expected - (r.amount || 0));
                return sum + (expected || r.amount || 0);
            }, 0);
            const totalAmount = paidAmount + dueAmount;
            const rate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
            panel.innerHTML = `
                <div class="summary-panel-head">
                    <div>
                        <div class="summary-panel-title">${year}ë…„ ìˆ˜ë‚© ìš”ì•½</div>
                        <div class="summary-panel-sub">ìƒì„±ëœ ìˆ˜ë‚© ê¸°ë¡ ê¸°ì¤€</div>
                    </div>
                    <div class="summary-panel-sub">${yearRents.length}ê±´</div>
                </div>
                <div class="summary-grid">
                    <div class="summary-cell">
                        <div class="summary-label">ìˆ˜ë‚©ë¥ </div>
                        <div class="summary-value primary">${rate}%</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">ë°›ì€ ê¸ˆì•¡</div>
                        <div class="summary-value success">${paidAmount.toLocaleString()}ì›</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">ë¯¸ë‚©</div>
                        <div class="summary-value danger">${dueRents.length}ê±´ Â· ${dueAmount.toLocaleString()}ì›</div>
                    </div>
                </div>
                <div class="summary-actions">
                    <button type="button" class="summary-mini-btn" onclick="generateAllMonthlyRents()">ì´ë²ˆë‹¬ ê¸°ë¡ ìƒì„±</button>
                    <button type="button" class="summary-mini-btn" onclick="switchPage('dashboardPage')">ëŒ€ì‹œë³´ë“œ ë³´ê¸°</button>
                </div>
            `;
        }
        function renderRents() {
            const container = document.getElementById('rentsList');
            container.innerHTML = '';
            // [ì¶”ê°€ê¸°ëŠ¥] ìˆ˜ë‚© íŽ˜ì´ì§€ ê²€ìƒ‰ í•„í„°
            const rentSearchEl = document.getElementById('rentSearch');
            const rentSearchQuery = rentSearchEl ? rentSearchEl.value.trim().toLowerCase() : '';
            const activeTenants = appData.tenants.filter(t => {
                if (t.status !== 'active') return false;
                // ê±´ë¬¼ í•„í„°
                if (_rentBuildingFilter && t.buildingId !== _rentBuildingFilter) return false;
                if (!rentSearchQuery) return true;
                const room = appData.rooms.find(r => r.id === t.roomId);
                const roomNum = room ? room.roomNumber.toLowerCase() : '';
                return t.name.toLowerCase().includes(rentSearchQuery) || roomNum.includes(rentSearchQuery);
            });
            if (activeTenants.length === 0) {
                renderRentSummary([], currentYear);
                container.innerHTML = rentSearchQuery
                    ? '<div class="empty-state"><div class="empty-state-icon">ðŸ”</div><p>ê²€ìƒ‰ ê²°ê³¼ê°€ ì—†ìŠµë‹ˆë‹¤</p></div>'
                    : '<div class="empty-state"><div class="empty-state-icon">ðŸ’°</div><p>ìž…ì£¼ ì¤‘ì¸ ì„¸ìž…ìžê°€ ì—†ìŠµë‹ˆë‹¤</p><button class="btn btn-primary" style="margin-top:16px;" onclick="switchPage(\'tenantsPage\')">ì„¸ìž…ìž ê´€ë¦¬ë¡œ ì´ë™</button></div>';
                return;
            }
            renderRentSummary(activeTenants, currentYear);
            // ì›”ì„¸/ì—°ì„¸ ë¶„ë¦¬
            const monthlyTenants = activeTenants.filter(t => (t.rentType || 'monthly') === 'monthly');
            const annualTenants = activeTenants.filter(t => t.rentType === 'annual');
            const { roomMap, buildingMap } = buildLookupMaps();
            const months = [1,2,3,4,5,6,7,8,9,10,11,12];
            const today = new Date();
            const todayStr = getMonthStr(today);
            // ì—°ì„¸ ì„¸ìž…ìž ì¹´ë“œ ë¨¼ì € í‘œì‹œ
            if (annualTenants.length > 0) {
                const annualHeader = document.createElement('div');
                annualHeader.style.cssText = 'font-size:15px;font-weight:700;color:#92400e;background:#fef3c7;padding:10px 14px;border-radius:10px;margin:12px 0 4px;';
                annualHeader.textContent = 'ðŸ“… ì—°ì„¸ ì„¸ìž…ìž';
                container.appendChild(annualHeader);
                annualTenants.forEach(tenant => {
                    const room = roomMap[tenant.roomId];
                    const building = buildingMap[tenant.buildingId];
                    const annualRent = appData.rents.filter(r => r.tenantId === tenant.id && (!r.type || r.type === 'monthly'));
                    const yearRent = annualRent.find(r => r.month && r.month.startsWith(currentYear + ''));
                    const isPaid = yearRent?.status === 'paid';
                    // [ë²„ê·¸ìˆ˜ì •] ê³„ì•½ ì‹œìž‘ì›” ê¸°ì¤€ìœ¼ë¡œ ë‚©ë¶€ì›” ê²°ì • (ê¸°ì¡´: ë¬´ì¡°ê±´ 01ì›” í•˜ë“œì½”ë”©)
                    const renewalMM = (tenant.contractStart || '').slice(5, 7) || '01';
                    const renewalMonthKey = currentYear + '-' + renewalMM;
                    const card = document.createElement('div');
                    card.className = 'rent-year-card';
                    card.innerHTML = `
                        <div class="rent-year-card-header">
                            <div>
                                <div class="rent-year-card-name">${escapeHTML(tenant.name)}</div>
                                <div class="rent-year-card-sub">${escapeHTML(building?.name ?? '-')} ${escapeHTML(room?.roomNumber ?? '-')}í˜¸ Â· â‚©${(tenant.monthlyRent || 0).toLocaleString()}/ë…„ Â· ë‚©ë¶€ì›”: ${renewalMM}ì›”</div>
                            </div>
                            <div>
                                ${isPaid
                                    ? '<span class="badge badge-success">ë‚©ë¶€ì™„ë£Œ</span>'
                                    : `<button onclick="markMonthCell('${tenant.id}','${renewalMonthKey}')" class="btn btn-secondary" style="padding:8px 14px;font-size:14px;white-space:nowrap;">ë‚©ë¶€ ì²˜ë¦¬</button>`
                                }
                            </div>
                        </div>`;
                    container.appendChild(card);
                });
            }
            // ê±´ë¬¼ â†’ í˜¸ì‹¤ ìˆœìœ¼ë¡œ ê·¸ë£¹í•‘ (ì›”ì„¸)
            const buildingOrder = appData.buildings.map(b => b.id);
            const grouped = {};
            monthlyTenants.forEach(tenant => {
                const bid = tenant.buildingId || '__none__';
                const rid = tenant.roomId || '__none__';
                if (!grouped[bid]) grouped[bid] = {};
                if (!grouped[bid][rid]) grouped[bid][rid] = [];
                grouped[bid][rid].push(tenant);
            });
            buildingOrder.forEach(bid => {
                if (!grouped[bid]) return;
                const building = buildingMap[bid];
                const roomIds = Object.keys(grouped[bid]).sort((a, b) => {
                    const ra = roomMap[a]?.roomNumber || '';
                    const rb = roomMap[b]?.roomNumber || '';
                    return ra.localeCompare(rb, undefined, { numeric: true });
                });
                // ê±´ë¬¼ í—¤ë”
                const buildingHeader = document.createElement('div');
                buildingHeader.style.cssText = 'font-size:14px;font-weight:800;color:#1e3a5f;background:#e8f0fe;padding:10px 14px;border-radius:8px;margin:14px 12px 6px;';
                buildingHeader.textContent = 'ðŸ¢ ' + (building?.name || 'ê±´ë¬¼');
                container.appendChild(buildingHeader);
                roomIds.forEach(rid => {
                    const room = roomMap[rid];
                    const tenants = grouped[bid][rid];
                    // í˜¸ì‹¤ í—¤ë”
                    const roomHeader = document.createElement('div');
                    roomHeader.style.cssText = 'font-size:13px;font-weight:800;color:#475569;padding:4px 14px;margin:6px 12px 0;';
                    roomHeader.textContent = 'ðŸšª ' + (room?.roomNumber ? room.roomNumber + 'í˜¸' : 'í˜¸ì‹¤');
                    container.appendChild(roomHeader);
                    tenants.forEach(tenant => {
                        const monthlyAmount = tenant.monthlyRent + (tenant.managementFee || 0);
                        const rentMap = {};
                        appData.rents.filter(r => r.tenantId === tenant.id && (!r.type || r.type === 'monthly') && r.month && r.month.startsWith(currentYear + '-'))
                            .forEach(r => { rentMap[r.month] = r; });
                        let paidCount = 0, pendingCount = 0;
                        const _mi2 = (tenant.moveInDate || '').slice(0,7);
                        const _cs2 = (tenant.contractStart || '').slice(0,7);
                        const tenantStartForCountRaw = _mi2 && _cs2 ? (_mi2 < _cs2 ? _mi2 : _cs2) : (_mi2 || _cs2);
                        // ìž…ì£¼ì¼ì´ ì˜¬í•´ ì´ì „ì´ë©´ 1ì›”ë¶€í„° ì „ë¶€ ì§‘ê³„
                        const tenantStartForCount = (tenantStartForCountRaw && tenantStartForCountRaw < currentYear + '-01')
                            ? null
                            : tenantStartForCountRaw;
                        const tenantEndForCount = (tenant.contractEnd || '').slice(0, 7);
                        months.forEach(m => {
                            const mStr = currentYear + '-' + String(m).padStart(2, '0');
                            if (tenantStartForCount && mStr < tenantStartForCount) return; // ìž…ì£¼ ì „ ì œì™¸
                            if (tenantEndForCount && mStr > tenantEndForCount) return; // í‡´ì‹¤ í›„ ì œì™¸
                            if (mStr > todayStr) return; // ë¯¸ëž˜ ì›”ì€ ë¯¸ë‚© ì§‘ê³„ ì œì™¸
                            const r = rentMap[mStr];
                            if (r?.status === 'paid') paidCount++;
                            else if (r?.status === 'pending' || r?.status === 'partial') pendingCount++;
                        });
                        // ìµœì´ˆìž…ì£¼ì¼(moveInDate ìš°ì„ , ì—†ìœ¼ë©´ contractStart) ê¸°ì¤€ ì›” ê³„ì‚°
                        const _mi = (tenant.moveInDate || '').slice(0,7);
                        const _cs = (tenant.contractStart || '').slice(0,7);
                        const tenantStartStrRaw = _mi && _cs ? (_mi < _cs ? _mi : _cs) : (_mi || _cs);
                        // ìž…ì£¼ì¼ì´ ì˜¬í•´ ì´ì „ì´ë©´ ì˜¬í•´ 1ì›”ë¶€í„° ì „ë¶€ ì •ìƒ ì¶”ì 
                        const tenantStartStr = (tenantStartStrRaw && tenantStartStrRaw < currentYear + '-01')
                            ? null
                            : tenantStartStrRaw;
                        // í‡´ì‹¤ì¼(contractEnd) ê¸°ì¤€ ì¢…ë£Œ ì›” ê³„ì‚°
                        const tenantEndStr = (tenant.contractEnd || '').slice(0, 7);
                        const monthCells = months.map(m => {
                            const mStr = currentYear + '-' + String(m).padStart(2, '0');
                            const r = rentMap[mStr];
                            const isFuture = mStr > todayStr;
                            // ìž…ì£¼ ì „ ì›”: í•´ë‹¹ì‚¬í•­ì—†ìŒ
                            const isBeforeMove = tenantStartStr && mStr < tenantStartStr;
                            // í‡´ì‹¤ í›„ ì›”: í•´ë‹¹ì‚¬í•­ì—†ìŒ (ë‹¨, ë‚©ë¶€/ë¶€ë¶„ë‚©ë¶€ ê¸°ë¡ ìžˆìœ¼ë©´ ê·¸ëŒ€ë¡œ í‘œì‹œ)
                            const isAfterEnd = tenantEndStr && mStr > tenantEndStr;
                            let cellClass = 'none';
                            let icon = 'â€”';
                            let dateStr = '';
                            if (isBeforeMove) {
                                return `<div class="rent-month-cell none" style="opacity:0.38;cursor:default;pointer-events:none;" title="ìž…ì£¼ ì „">
                                    <div class="m-label">${m}ì›”</div>
                                    <div class="m-icon">â€”</div>
                                </div>`;
                            } else if (isAfterEnd && (!r || r.status === 'pending')) {
                                // í‡´ì‹¤ í›„ ë¯¸ë‚©/ê¸°ë¡ì—†ìŒ â†’ í•´ë‹¹ì‚¬í•­ì—†ìŒ
                                return `<div class="rent-month-cell none" style="opacity:0.38;cursor:default;pointer-events:none;" title="í‡´ì‹¤ í›„">
                                    <div class="m-label">${m}ì›”</div>
                                    <div class="m-icon">â€”</div>
                                </div>`;
                            } else if (r) {
                                if (r.status === 'paid') {
                                    cellClass = 'paid'; icon = 'âœ“';
                                    if (r.paidDate) {
                                        const d = new Date(r.paidDate);
                                        dateStr = `${d.getMonth()+1}/${d.getDate()}`;
                                    }
                                } else if (r.status === 'partial') {
                                    cellClass = 'partial'; icon = 'â—';
                                    if (r.paidDate) {
                                        const d = new Date(r.paidDate);
                                        dateStr = `${d.getMonth()+1}/${d.getDate()}`;
                                    }
                                } else if (isFuture) {
                                    // ë¯¸ëž˜ ì›”: ë¯¸ë‚© ê¸°ë¡ ìžˆì–´ë„ ì ìœ¼ë¡œ í‘œì‹œ (ì•„ì§ ë‚©ë¶€ ê¸°ê°„ ì•„ë‹˜)
                                    icon = 'Â·';
                                } else {
                                    cellClass = 'pending'; icon = 'âœ•';
                                }
                            } else if (isFuture) {
                                icon = 'Â·';
                            }
                            // ë¯¸ëž˜ ì›”ì€ í´ë¦­ ë¹„í™œì„±í™” (ì‹¤ìˆ˜ë¡œ ê¸°ë¡ ìƒì„± ë°©ì§€)
                            const onClickAttr = isFuture ? '' : `onclick="markMonthCell('${tenant.id}','${mStr}')"`;
                            // ë¶€ë¶„ë‚©ë¶€ ì…€ì— ìž”ì•¡ íˆ´íŒ
                            let cellTitle = '';
                            if (r && r.status === 'partial') {
                                const _exp = (r.rentAmount||0) + (r.managementFee||0);
                                const _bal = Math.max(0, _exp - (r.amount||0));
                                cellTitle = `title="ë°›ìŒ â‚©${(r.amount||0).toLocaleString()} / ìž”ì•¡ â‚©${_bal.toLocaleString()}"`;
                            }
                            return `<div class="rent-month-cell ${cellClass}${isFuture ? ' future-cell' : ''}" ${onClickAttr} ${cellTitle} style="${isFuture ? 'cursor:default;' : ''}">
                                <div class="m-label">${m}ì›”</div>
                                <div class="m-icon">${icon}</div>
                                ${dateStr ? `<div class="m-date">${dateStr}</div>` : ''}
                            </div>`;
                        }).join('');
                        const card = document.createElement('div');
                        card.className = 'rent-year-card';
                        card.innerHTML = `
                            <div class="rent-year-card-header" onclick="showTenantDetail('${tenant.id}')" style="cursor:pointer;">
                                <div>
                                    <div class="rent-year-card-name">${escapeHTML(tenant.name)}</div>
                                    <div class="rent-year-card-sub">â‚©${monthlyAmount.toLocaleString()}/ì›”</div>
                                </div>
                                <div class="rent-year-card-summary">
                                    <span class="rent-summary-pill ok">ë‚©ë¶€ ${paidCount}</span>
                                    <span class="rent-summary-pill bad">ë¯¸ë‚© ${pendingCount}</span>
                                    <span style="font-size:16px;color:#94A3B8;margin-left:4px;">â€º</span>
                                </div>
                            </div>
                            <div class="rent-months-grid">${monthCells}</div>
                        `;
                        container.appendChild(card);
                    });
                });
            });
        }
        function filterRents(filter) {
            renderRents();
        }
        // ============ RECEIPT HELPERS ============
        function compressImage(dataUrl, maxW, quality) {
            return new Promise(function(resolve) {
                var img = new Image();
                img.onload = function() {
                    var scale = Math.min(1, maxW / img.width);
                    var canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = function() { resolve(dataUrl); };
                img.src = dataUrl;
            });
        }

        function renderReceiptPreviews() {
            var wrap = document.getElementById('receiptPreviewList');
            if (!wrap) return;
            wrap.innerHTML = '';
            _pendingReceipts.forEach(function(src, i) {
                var div = document.createElement('div');
                div.className = 'receipt-thumb';
                div.innerHTML = '<img src="' + src + '" onclick="openReceiptViewer(_pendingReceipts,' + i + ')">'
                    + '<div class="receipt-thumb-del" onclick="event.stopPropagation();removePendingReceipt(' + i + ')">âœ•</div>';
                wrap.appendChild(div);
            });
        }

        function handleReceiptUpload(files) {
            if (!files || !files.length) return;
            var promises = [];
            for (var i = 0; i < files.length; i++) {
                promises.push((function(file) {
                    return new Promise(function(resolve) {
                        var reader = new FileReader();
                        reader.onload = function(ev) {
                            compressImage(ev.target.result, 1200, 0.75).then(resolve);
                        };
                        reader.readAsDataURL(file);
                    });
                })(files[i]));
            }
            Promise.all(promises).then(function(results) {
                results.forEach(function(r) { _pendingReceipts.push(r); });
                renderReceiptPreviews();
                document.getElementById('receiptInput').value = '';
            });
        }

        function removePendingReceipt(idx) {
            _pendingReceipts.splice(idx, 1);
            renderReceiptPreviews();
        }

        // Full-screen receipt viewer
        function openReceiptViewer(imagesArr, startIdx) {
            _viewerReceipts = imagesArr.slice();
            _viewerIdx = startIdx || 0;
            _showViewerFrame();
            document.getElementById('receiptViewerOverlay').style.display = 'flex';
        }
        function _showViewerFrame() {
            document.getElementById('receiptViewerImg').src = _viewerReceipts[_viewerIdx];
            document.getElementById('receiptViewerCounter').textContent = (_viewerIdx+1) + ' / ' + _viewerReceipts.length;
        }
        function receiptViewerNav(dir) {
            _viewerIdx = (_viewerIdx + dir + _viewerReceipts.length) % _viewerReceipts.length;
            _showViewerFrame();
        }
        function closeReceiptViewer(e) {
            if (e.target === document.getElementById('receiptViewerOverlay')) {
                document.getElementById('receiptViewerOverlay').style.display = 'none';
            }
        }

        // ============ EXPENSE SELECTION (print / share) ============
        function toggleExpenseSelect(id, chkEl) {
            if (_selectedExpenses.has(id)) {
                _selectedExpenses.delete(id);
                chkEl.classList.remove('checked');
                chkEl.textContent = '';
            } else {
                _selectedExpenses.add(id);
                chkEl.classList.add('checked');
                chkEl.textContent = 'âœ“';
            }
            _updateExpenseActionBar();
        }
        function _updateExpenseActionBar() {
            var bar = document.getElementById('expenseActionBar');
            var cnt = _selectedExpenses.size;
            if (cnt === 0) { bar.style.display = 'none'; return; }
            bar.style.display = 'flex';
            document.getElementById('expenseSelCount').textContent = cnt + 'ê°œ ì„ íƒ';
        }
        function clearExpenseSelection() {
            _selectedExpenses.clear();
            document.querySelectorAll('.expense-check').forEach(function(el) {
                el.classList.remove('checked'); el.textContent = '';
            });
            document.getElementById('expenseActionBar').style.display = 'none';
        }

        function printSelectedReceipts() {
            var ids = Array.from(_selectedExpenses);
            var expenses = (appData.expenses || []).filter(function(e) {
                return ids.indexOf(e.id) !== -1 && e.receipts && e.receipts.length;
            });
            if (!expenses.length) { showToast('ì„ íƒëœ í•­ëª©ì— ì²¨ë¶€íŒŒì¼ì´ ì—†ìŠµë‹ˆë‹¤'); return; }
            var html = '<html><head><meta charset="utf-8"><title>\uc601\uc218\uc99d \ucd9c\ub825</title>'
                + '<style>body{font-family:sans-serif;margin:0;padding:16px;background:#fff;}'
                + '.page{page-break-after:always;margin-bottom:24px;}'
                + 'h2{font-size:18px;margin:0 0 4px;}'
                + 'p{margin:0 0 10px;color:#555;font-size:13px;}'
                + 'img{max-width:100%;border-radius:6px;margin:6px 0;display:block;}'
                + '</style></head><body>';
            expenses.forEach(function(exp) {
                var bld = (appData.buildings||[]).find(function(b){return b.id===exp.buildingId;});
                var rm  = exp.roomId ? (appData.rooms||[]).find(function(r){return r.id===exp.roomId;}) : null;
                var loc = (bld ? bld.name+' ' : '') + (rm ? rm.roomNumber+'\ud638' : '\uc804\uccb4');
                html += '<div class="page"><h2>' + exp.title + '</h2>'
                    + '<p>' + exp.date + ' | ' + exp.category + ' | \u20a9' + exp.amount.toLocaleString() + ' | ' + loc + '</p>';
                if (exp.memo) html += '<p style="color:#888;">\uba54\ubaa8: ' + exp.memo + '</p>';
                exp.receipts.forEach(function(src) {
                    html += '<img src="' + src + '">';
                });
                html += '</div>';
            });
            html += '<script>window.onload=function(){window.print();}<\/script></body></html>';
            var w = window.open('', '_blank');
            if (!w) { showToast('\ud31d\uc5c5\uc774 \uc0ac\uc6a9 \ub4f1\ub85d\uc744 \ud5c8\uc6a9\ud574\uc8fc\uc138\uc694'); return; }
            w.document.write(html);
            w.document.close();
        }

        async function shareSelectedReceipts() {
            var ids = Array.from(_selectedExpenses);
            var expenses = (appData.expenses || []).filter(function(e) {
                return ids.indexOf(e.id) !== -1 && e.receipts && e.receipts.length;
            });
            if (!expenses.length) { showToast('\uccb4\ud06c\ub41c \ud56d\ubaa9\uc5d0 \uccb8\ubd80\ud30c\uc77c\uc774 \uc5c6\uc2b5\ub2c8\ub2e4'); return; }
            if (!navigator.share) { showToast('\uc774 \uae30\uae30\uc5d0\uc11c\ub294 \uacf5\uc720 \uae30\ub2a5\uc744 \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4'); return; }
            try {
                var files = [];
                var idx = 1;
                for (var ei = 0; ei < expenses.length; ei++) {
                    var exp = expenses[ei];
                    for (var ri = 0; ri < exp.receipts.length; ri++) {
                        var resp = await fetch(exp.receipts[ri]);
                        var blob = await resp.blob();
                        var fname = exp.title.replace(/[^\w\uAC00-\uD7A3]/g, '_') + '_' + idx + '.jpg';
                        files.push(new File([blob], fname, {type: 'image/jpeg'}));
                        idx++;
                    }
                }
                var shareData = {files: files, title: '\uc9c0\ucd9c \uc601\uc218\uc99d'};
                if (navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    await navigator.share({title: '\uc9c0\ucd9c \uc601\uc218\uc99d', text: '\uccb8\ubd80\ub41c \uc601\uc218\uc99d ' + files.length + '\uc7a5'});
                }
            } catch(err) {
                if (err.name !== 'AbortError') showToast('\uacf5\uc720\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4');
            }
        }

        // ============ EXPENSES ============
        function saveExpense(e) {
            e.preventDefault();
            const expenseTitle = document.getElementById('expenseTitle').value.trim();
            const expenseAmount = parseInt(document.getElementById('expenseAmount').value);
            if (!expenseTitle) { showToast('âš ï¸ ì§€ì¶œ í•­ëª©ëª…ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            if (!expenseAmount || isNaN(expenseAmount) || expenseAmount <= 0) { showToast('âš ï¸ ê¸ˆì•¡ì„ ì˜¬ë°”ë¥´ê²Œ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            // ê¸°ì¡´ ì˜ìˆ˜ì¦ ë³´ì¡´ (ìˆ˜ì • ì‹œ) + ìƒˆë¡œ ì¶”ê°€ëœ _pendingReceipts í•©ì¹˜ê¸°
            const existingReceipts = editingId
                ? ((appData.expenses.find(e => e.id === editingId) || {}).receipts || [])
                : [];
            const expenseData = {
                id: editingId || Date.now().toString(),
                roomId: document.getElementById('expenseRoom').value,
                buildingId: (() => { const r = appData.rooms.find(rm => rm.id === document.getElementById('expenseRoom').value); return r?.buildingId || ''; })(),
                category: document.getElementById('expenseCategory').value,
                title: expenseTitle,
                amount: expenseAmount,
                date: document.getElementById('expenseDate').value,
                memo: document.getElementById('expenseMemo').value,
                receipts: existingReceipts.concat(_pendingReceipts)
            };
            if (editingId) {
                const index = appData.expenses.findIndex(e => e.id === editingId);
                appData.expenses[index] = expenseData;
            } else {
                appData.expenses.push(expenseData);
            }
            saveData();
            closeModal('addExpenseModal');
            renderExpenses();
            showToast(editingId ? 'ì§€ì¶œì´ ìˆ˜ì •ë˜ì—ˆìŠµë‹ˆë‹¤' : 'ì§€ì¶œì´ ì¶”ê°€ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function editExpense(id) {
            const expense = appData.expenses.find(e => e.id === id);
            openModal('addExpenseModal');
            editingId = id;
            loadExpenseModalRooms();
            document.getElementById('expenseRoom').value = expense.roomId || '';
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseTitle').value = expense.title;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseMemo').value = expense.memo || '';
            document.getElementById('expenseModalTitle').textContent = 'ì§€ì¶œ ìˆ˜ì •';
            document.getElementById('deleteExpenseBtn').style.display = 'block';
            // ê¸°ì¡´ ì˜ìˆ˜ì¦ ë¡œë“œ (íŽ¸ì§‘ ì‹œ ê¸°ì¡´ ê²ƒì„ _pendingReceiptsì— ë„£ì–´ ë³´ì—¬ì¤Œ)
            _pendingReceipts = (expense.receipts || []).slice();
            renderReceiptPreviews();
        }
        function deleteExpense() {
            const _eid = editingId;
            showConfirm('ì´ ì§€ì¶œ ê¸°ë¡ì„ ì‚­ì œí•˜ì‹œê² ìŠµë‹ˆê¹Œ?', function() {
                appData.expenses = appData.expenses.filter(e => e.id !== _eid);
                saveData();
                closeModal('addExpenseModal');
                renderExpenses();
                showToast('ì§€ì¶œì´ ì‚­ì œë˜ì—ˆìŠµë‹ˆë‹¤');
            });
        }

        function renderExpenseRoomChart(expenses) {
            var chartEl = document.getElementById('expenseRoomChart');
            if (!chartEl) return;
            var list = expenses && expenses.length ? expenses : [];
            if (list.length === 0) { chartEl.style.display = 'none'; return; }
            chartEl.style.display = 'block';

            var totals = {};
            list.forEach(function(e) {
                var room = e.roomId ? (appData.rooms || []).find(function(r){ return r.id === e.roomId; }) : null;
                var bld  = (appData.buildings || []).find(function(b){ return b.id === e.buildingId; });
                var key  = e.roomId || '_';
                var lbl  = room ? ((bld && bld.name ? bld.name + ' ' : '') + room.roomNumber + '\ud638') : '\uacf5\ud1b5/\uc804\uccb4';
                if (!totals[key]) totals[key] = { label: lbl, amount: 0 };
                totals[key].amount += (e.amount || 0);
            });

            var entries = Object.values(totals).sort(function(a,b){ return b.amount - a.amount; });
            var maxAmt  = entries[0].amount || 1;
            var total   = entries.reduce(function(s,e){ return s + e.amount; }, 0);
            var colors  = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];

            var rows = '';
            entries.forEach(function(entry, i) {
                var pct   = Math.max(4, Math.round(entry.amount / maxAmt * 100));
                var share = Math.round(entry.amount / total * 100);
                var color = colors[i % colors.length];
                rows += '<div style="margin-bottom:12px;">'
                    + '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">'
                    + '<span style="font-size:13px;font-weight:600;color:#374151;">' + escapeHTML(entry.label) + '</span>'
                    + '<span style="font-size:12px;color:#6b7280;">' + share + '%&nbsp;'
                    + '<strong style="color:#111827;">&#8361;' + entry.amount.toLocaleString() + '</strong></span>'
                    + '</div>'
                    + '<div style="background:#f1f5f9;border-radius:6px;height:10px;overflow:hidden;">'
                    + '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:6px;"></div>'
                    + '</div></div>';
            });

            chartEl.innerHTML = '<div style="font-size:14px;font-weight:700;color:#1e3a5f;margin-bottom:12px;">'
                + '\uD83D\uDCCA \ud638\uc2e4\ubcc4 \uc9c0\ucd9c'
                + '<span style="font-size:12px;font-weight:400;color:#6b7280;margin-left:8px;">'
                + '\ud569\uacc4 &#8361;' + total.toLocaleString() + '</span></div>'
                + rows;
        }

        function renderExpenseMonthChart(expenses) {
            var chartEl = document.getElementById('expenseMonthChart');
            if (!chartEl) return;
            if (!expenses || expenses.length === 0) { chartEl.style.display = 'none'; return; }

            // ì›”ë³„ í•©ì‚° (ìµœê·¼ 12ê°œì›” ë˜ëŠ” ë°ì´í„° ìžˆëŠ” ì „ì²´)
            var byMonth = {};
            expenses.forEach(function(e) {
                var m = (e.date || '').slice(0, 7);
                if (!m) return;
                byMonth[m] = (byMonth[m] || 0) + (e.amount || 0);
            });
            var months = Object.keys(byMonth).sort();
            if (months.length === 0) { chartEl.style.display = 'none'; return; }
            // ìµœê·¼ 12ê°œì›”ë¡œ ì œí•œ
            if (months.length > 12) months = months.slice(months.length - 12);
            chartEl.style.display = 'block';

            var maxAmt = Math.max.apply(null, months.map(function(m) { return byMonth[m] || 0; })) || 1;
            var bars = months.map(function(m) {
                var amt = byMonth[m] || 0;
                var pct = Math.max(4, Math.round(amt / maxAmt * 100));
                var label = m.slice(5) + 'ì›”'; // MMì›”
                var amtStr = amt >= 10000 ? Math.round(amt/10000) + 'ë§Œ' : amt.toLocaleString();
                return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:0;">' +
                    '<div style="font-size:9px;color:#94A3B8;font-weight:600;">' + amtStr + '</div>' +
                    '<div style="width:100%;background:#EFF6FF;border-radius:4px;overflow:hidden;height:60px;display:flex;align-items:flex-end;">' +
                    '<div style="width:100%;height:' + pct + '%;background:linear-gradient(180deg,#6366F1,#818CF8);border-radius:4px 4px 0 0;transition:height 0.3s;"></div>' +
                    '</div>' +
                    '<div style="font-size:9px;color:#64748B;font-weight:700;white-space:nowrap;">' + label + '</div>' +
                    '</div>';
            }).join('');

            chartEl.innerHTML =
                '<div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:10px;">ðŸ“ˆ ì›”ë³„ ì§€ì¶œ ì¶”ì´</div>' +
                '<div style="display:flex;gap:4px;align-items:flex-end;">' + bars + '</div>';
        }
        function renderExpenseSummary(filtered) {
            const panel = document.getElementById('expenseSummaryPanel');
            if (!panel) return;
            const list = filtered || [];
            const today = new Date();
            const monthStr = getMonthStr(today);
            const total = list.reduce((sum, e) => sum + (e.amount || 0), 0);
            const thisMonth = list
                .filter(e => (e.date || '').startsWith(monthStr))
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            const receiptCount = list.reduce((sum, e) => sum + ((e.receipts || []).length), 0);
            panel.innerHTML = `
                <div class="summary-panel-head">
                    <div>
                        <div class="summary-panel-title">ì§€ì¶œ ìš”ì•½</div>
                        <div class="summary-panel-sub">í˜„ìž¬ í•„í„° ê¸°ì¤€</div>
                    </div>
                    <div class="summary-panel-sub">${list.length}ê±´</div>
                </div>
                <div class="summary-grid">
                    <div class="summary-cell">
                        <div class="summary-label">ì´ ì§€ì¶œ</div>
                        <div class="summary-value danger">${total.toLocaleString()}ì›</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">ì´ë²ˆë‹¬</div>
                        <div class="summary-value primary">${thisMonth.toLocaleString()}ì›</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">ì˜ìˆ˜ì¦</div>
                        <div class="summary-value">${receiptCount}ìž¥</div>
                    </div>
                </div>
            `;
        }

        function renderExpenses() {
            const container = document.getElementById('expensesList');
            // [ì¶”ê°€ê¸°ëŠ¥] ì§€ì¶œ íŽ˜ì´ì§€ í…ìŠ¤íŠ¸ ê²€ìƒ‰ í•„í„°
            const expSearchEl = document.getElementById('expenseSearch');
            const expSearchQuery = expSearchEl ? expSearchEl.value.trim().toLowerCase() : '';
            let filtered = appData.expenses;
            if (_selectedExpenseRooms.size > 0) {
                filtered = filtered.filter(e => _selectedExpenseRooms.has(e.roomId) || !e.roomId);
            }
            if (expSearchQuery) {
                filtered = filtered.filter(e =>
                    (e.title || '').toLowerCase().includes(expSearchQuery) ||
                    (e.memo || '').toLowerCase().includes(expSearchQuery) ||
                    (e.category || '').toLowerCase().includes(expSearchQuery)
                );
            }
            renderExpenseSummary(filtered);
            // í˜¸ì‹¤ë³„ ì°¨íŠ¸
            renderExpenseRoomChart(filtered || []);
            // ì›”ë³„ ì¶”ì´ ì°¨íŠ¸
            renderExpenseMonthChart(filtered || []);
            // Render category summary
            const categorySummary = {};
            filtered.forEach(e => {
                categorySummary[e.category] = (categorySummary[e.category] || 0) + e.amount;
            });
            const summaryContainer = document.getElementById('categorySummary');
            const categoryEntries = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);
            summaryContainer.innerHTML = categoryEntries.length
                ? '<div class="category-summary-title">ì¹´í…Œê³ ë¦¬ë³„</div>' +
                    categoryEntries.map(([cat, amount]) => `
                        <div class="category-item">
                            <div class="category-name">${escapeHTML(cat)}</div>
                            <div class="category-amount">â‚©${amount.toLocaleString()}</div>
                        </div>
                    `).join('')
                : '';
            // Render list
            container.innerHTML = '';
            if (filtered.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ“„</div><p>ì§€ì¶œì´ ì—†ìŠµë‹ˆë‹¤</p><button class="btn btn-primary" style="margin-top:16px;" onclick="openModal(\'addExpenseModal\')">+ ì§€ì¶œ ì¶”ê°€</button></div>';
                return;
            }
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            filtered.forEach(expense => {
                const building = appData.buildings.find(b => b.id === expense.buildingId);
                const room = expense.roomId ? appData.rooms.find(r => r.id === expense.roomId) : null;
                const item = document.createElement('div');
                item.className = 'expense-list-card';
                item.style.cursor = 'pointer';
                item.style.touchAction = 'manipulation';
                const roomDisplay = room ? ` ${room.roomNumber}í˜¸` : 'ì „ì²´';
                const hasReceipts = expense.receipts && expense.receipts.length > 0;
                const receiptBadge = hasReceipts
                    ? `<span class="expense-meta-chip">ðŸ“Ž ${expense.receipts.length}ìž¥</span>` : '';
                const isChecked = _selectedExpenses.has(expense.id);
                item.innerHTML = `
                    <div class="list-item">
                        <div class="expense-check${isChecked ? ' checked' : ''}" data-eid="${expense.id}">${isChecked ? 'âœ“' : ''}</div>
                        <div class="list-item-avatar" style="background: linear-gradient(135deg, #f59e0b, #fbbf24); font-size: 20px;">ðŸ”§</div>
                        <div class="list-item-content">
                            <div class="list-item-title">${escapeHTML(expense.title)}</div>
                            <div class="expense-meta-line">
                                <span class="expense-meta-chip">${escapeHTML(expense.category)}</span>
                                <span>${escapeHTML(building?.name ?? '')} <strong style="color:#1e3a5f;">${escapeHTML(roomDisplay)}</strong></span>
                                <span>${escapeHTML(expense.date)}</span>
                                ${receiptBadge}
                            </div>
                        </div>
                        <div class="list-item-right">
                            <div class="list-item-amount" style="color: var(--danger);">-â‚©${expense.amount.toLocaleString()}</div>
                        </div>
                    </div>
                `;
                // ì²´í¬ë°•ìŠ¤: toggleExpenseSelect / ë‚˜ë¨¸ì§€ ì˜ì—­: editExpense
                const chkEl = item.querySelector('.expense-check');
                chkEl.addEventListener('click', function(ev) {
                    ev.stopPropagation();
                    toggleExpenseSelect(expense.id, chkEl);
                });
                item.addEventListener('click', function() { editExpense(expense.id); });
                container.appendChild(item);
            });
        }
        // ============ DASHBOARD ============
        function openRentTenantDetailFromUnpaid(tenantId) {
            if (!tenantId) { showToast('âš ï¸ ì„¸ìž…ìž ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            closeModal('dashboardDetailModal');
            switchPage('rentPage');
            showTenantDetail(tenantId);
        }
        function showUnpaidDetail(monthStr) {
            monthStr = monthStr || getMonthStr(new Date());
            const unpaidRents = appData.rents.filter(r => r.month === monthStr && (r.status === 'pending' || r.status === 'overdue') && (!r.type || r.type === 'monthly'));
            const { tenantMap, roomMap, buildingMap } = buildLookupMaps();
            let html = '';
            if (unpaidRents.length === 0) {
                html = '<div class="empty-state"><p>ì´ ë‹¬ì˜ ë¯¸ë‚© ë‚´ì—­ì´ ì—†ìŠµë‹ˆë‹¤</p></div>';
            } else {
                const totalUnpaid = unpaidRents.reduce((sum, rent) => sum + (rent.amount || 0), 0);
                html = `
                    <div style="padding:14px 16px;border-bottom:1px solid var(--border-color);background:#fff7f7;">
                        <div style="font-size:13px;color:#991b1b;font-weight:700;margin-bottom:4px;">ë¯¸ë‚© ìš”ì•½</div>
                        <div style="font-size:22px;font-weight:900;color:var(--danger);">â‚©${totalUnpaid.toLocaleString()}</div>
                        <div style="font-size:13px;color:#6b7280;margin-top:4px;">ì´ ${unpaidRents.length}ê±´ì˜ ë¯¸ë‚©ì´ ìžˆìŠµë‹ˆë‹¤</div>
                    </div>`;
                unpaidRents.forEach(rent => {
                    const tenant = tenantMap[rent.tenantId];
                    const room = roomMap[rent.roomId];
                    const building = buildingMap[rent.buildingId];
                    html += `
                        <div class="list-item" style="border-bottom:1px solid var(--border-color);">
                            <div class="list-item-avatar" style="background:#fee2e2;color:#991b1b;font-size:18px;">âœ•</div>
                            <div class="list-item-content">
                                <button type="button" class="list-item-title" onclick="openRentTenantDetailFromUnpaid('${rent.tenantId}')" style="display:inline;padding:0;border:none;background:none;color:var(--primary);font:inherit;font-weight:800;text-align:left;cursor:pointer;text-decoration:underline;text-underline-offset:3px;">${tenant?.name || 'ì„¸ìž…ìž ë¯¸ìƒ'}</button>
                                <div class="list-item-subtitle">${building?.name || ''} ${room?.roomNumber || ''}í˜¸ Â· ${rent.month}</div>
                            </div>
                            <div class="list-item-right">
                                <div class="list-item-amount" style="color:var(--danger);">â‚©${rent.amount.toLocaleString()}</div>
                            </div>
                        </div>`;
                });
            }
            const [detailYear, detailMonth] = monthStr.split('-');
            document.getElementById('dashboardDetailTitle').textContent = `âš ï¸ ${detailYear}ë…„ ${parseInt(detailMonth, 10)}ì›” ë¯¸ë‚© í˜„í™©`;
            document.getElementById('dashboardDetailContent').innerHTML = html;
            openModal('dashboardDetailModal');
        }
        function showExpiringDetail() {
            const today = new Date();
            const expiringTenants = appData.tenants.filter(t => {
                const endDate = new Date(t.contractEnd);
                const days = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
                return days >= 0 && days <= 30;
            }).sort((a, b) => new Date(a.contractEnd) - new Date(b.contractEnd));
            const { roomMap, buildingMap } = buildLookupMaps();
            let html = '';
            if (expiringTenants.length === 0) {
                html = '<div class="empty-state"><p>ë§Œë£Œ ìž„ë°• ê³„ì•½ì´ ì—†ìŠµë‹ˆë‹¤</p></div>';
            } else {
                expiringTenants.forEach(t => {
                    const room = roomMap[t.roomId];
                    const building = buildingMap[t.buildingId];
                    const endDate = new Date(t.contractEnd);
                    const days = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
                    const urgency = days <= 7 ? 'color:#dc2626;font-weight:700;' : 'color:#d97706;font-weight:600;';
                    html += `
                        <div class="list-item" style="border-bottom:1px solid var(--border-color);" onclick="showTenantDetail('${t.id}')">
                            <div class="list-item-avatar" style="background:#fef3c7;color:#92400e;font-size:18px;">ðŸ“‹</div>
                            <div class="list-item-content">
                                <div class="list-item-title">${t.name}</div>
                                <div class="list-item-subtitle">${building?.name || ''} ${room?.roomNumber || ''}í˜¸ Â· ë§Œë£Œ: ${t.contractEnd}</div>
                            </div>
                            <div class="list-item-right">
                                <div style="font-size:15px;${urgency}">${days}ì¼ í›„</div>
                            </div>
                        </div>`;
                });
            }
            document.getElementById('dashboardDetailTitle').textContent = `ðŸ“‹ ê³„ì•½ë§Œë£Œ ìž„ë°• (${expiringTenants.length}ê±´)`;
            document.getElementById('dashboardDetailContent').innerHTML = html;
            openModal('dashboardDetailModal');
        }
        function renderDashboard() {
            const today = new Date();
            const monthStr = getMonthStr(today);
            const monthRents = appData.rents.filter(r => r.month === monthStr);
            const paidRents = monthRents.filter(r => r.status === 'paid');
            const monthlyIncome = paidRents.reduce((sum, r) => sum + r.amount, 0);
            const unpaidRents = appData.rents.filter(r => {
                if (!((r.status === 'pending' || r.status === 'overdue') && r.month <= monthStr)) return false;
                const t = appData.tenants.find(t => t.id === r.tenantId);
                const tEnd = t ? (t.contractEnd || '').slice(0, 7) : '';
                return !tEnd || r.month <= tEnd; // ê³„ì•½ì¢…ë£Œ ì´í›„ ì›”ì€ ë¯¸ë‚© ì§‘ê³„ ì œì™¸
            });
            // ì´ë²ˆë‹¬ ìˆ˜ìž…ì˜ˆì •: ì›”ì„¸ëŠ” ë§¤ë‹¬, ì—°ì„¸ëŠ” ê³„ì•½ ì‹œìž‘ ì›”ì—ë§Œ í¬í•¨
            const thisMonth = String(today.getMonth() + 1).padStart(2, '0'); // 'MM'
            const monthlyExpected = appData.tenants
                .filter(t => t.status === 'active')
                .reduce((sum, t) => {
                    if ((t.rentType || 'monthly') === 'annual') {
                        // ì—°ì„¸: contractStart ì›”ê³¼ ì´ë²ˆë‹¬ì´ ê°™ì„ ë•Œë§Œ í¬í•¨
                        const renewalMM = (t.contractStart || '').slice(5, 7);
                        return renewalMM === thisMonth ? sum + (t.monthlyRent || 0) : sum;
                    }
                    // ì›”ì„¸: ë§¤ë‹¬ í¬í•¨
                    return sum + (t.monthlyRent || 0) + (t.managementFee || 0);
                }, 0);
            document.getElementById('monthlyIncomeDisplay').textContent = 'â‚©' + monthlyIncome.toLocaleString();
            document.getElementById('monthlyExpectedDisplay').textContent = 'â‚©' + monthlyExpected.toLocaleString();
            // Unpaid Alert
            const unpaidAlert = document.getElementById('unpaidAlert');
            if (unpaidRents.length > 0) {
                unpaidAlert.style.display = 'block';
                document.getElementById('unpaidCount').innerHTML = `âš ï¸ ${unpaidRents.length}ê±´ì˜ ë¯¸ë‚©ì´ ìžˆìŠµë‹ˆë‹¤`;
            } else {
                unpaidAlert.style.display = 'none';
            }
            // Expiring Contracts Alert
            const expiringTenants = appData.tenants.filter(t => {
                const endDate = new Date(t.contractEnd);
                const daysUntilEnd = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
                return daysUntilEnd >= 0 && daysUntilEnd <= 30;
            });
            const expiringAlert = document.getElementById('expiringAlert');
            if (expiringTenants.length > 0) {
                expiringAlert.style.display = 'block';
                let expiringHtml = `ðŸ“‹ ${expiringTenants.length}ê±´ì˜ ê³„ì•½ì´ 30ì¼ ì´ë‚´ ë§Œë£Œë©ë‹ˆë‹¤<br>`;
                expiringTenants.slice(0, 3).forEach(t => {
                    const endDate = new Date(t.contractEnd);
                    const daysUntilEnd = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
                    expiringHtml += `â€¢ ${t.name} (${daysUntilEnd}ì¼)<br>`;
                });
                document.getElementById('expiringCount').innerHTML = expiringHtml;
            } else {
                expiringAlert.style.display = 'none';
            }
            // Vacant Alert
            const vacantRooms = appData.rooms.filter(r => r.status === 'vacant');
            const vacantAlert = document.getElementById('vacantAlert');
            if (vacantRooms.length > 0) {
                vacantAlert.style.display = 'block';
                let vacantHtml = `ðŸ  ${vacantRooms.length}ê°œì˜ ê³µì‹¤ì´ ìžˆìŠµë‹ˆë‹¤<br>`;
                vacantRooms.slice(0, 5).forEach(r => {
                    const building = appData.buildings.find(b => b.id === r.buildingId);
                    vacantHtml += `â€¢ ${building?.name} ${r.roomNumber}<br>`;
                });
                document.getElementById('vacantList').innerHTML = vacantHtml;
            } else {
                vacantAlert.style.display = 'none';
            }
            // ë±ƒì§€ëŠ” íŒ¨ì¹˜ëœ renderDashboard(ížˆìŠ¤í† ë¦¬ 4ê°œì›” ì§‘ê³„)ì—ì„œ ë‹¨ë… ê´€ë¦¬
        }
        // ============ UTILITIES ============
        // â”€â”€ ê³µìš© í™•ì¸ ë‹¤ì´ì–¼ë¡œê·¸ â”€â”€
        let _appConfirmCallback = null;
        function showConfirm(message, onConfirm, okLabel, isDanger) {
            _appConfirmCallback = onConfirm;
            document.getElementById('appConfirmMsg').textContent = message;
            const okBtn = document.getElementById('appConfirmOkBtn');
            okBtn.textContent = okLabel || 'í™•ì¸';
            okBtn.className = isDanger === false ? 'btn btn-primary' : 'btn btn-danger';
            openModal('appConfirmModal');
        }
        function _appConfirmResolve(confirmed) {
            closeModal('appConfirmModal');
            if (confirmed && typeof _appConfirmCallback === 'function') _appConfirmCallback();
            _appConfirmCallback = null;
        }
        // â”€â”€ ë³´ì¦ê¸ˆ ë°˜í™˜ ëª¨ë‹¬ â”€â”€
        let _depositRefundTenantId = null;
        function refundDepositModal(tenantId) {
            _depositRefundTenantId = tenantId;
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('depositRefundDateInput').value = today;
            openModal('depositRefundModal');
        }
        function _submitDepositRefund() {
            const refundDate = document.getElementById('depositRefundDateInput').value;
            if (!refundDate) { showToast('âš ï¸ ë°˜í™˜ì¼ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            const tenantId = _depositRefundTenantId;
            const index = appData.tenants.findIndex(t => t.id === tenantId);
            if (index === -1) { closeModal('depositRefundModal'); return; }
            const tenant = appData.tenants[index];
            appData.tenants[index].depositRefunded = true;
            appData.tenants[index].depositRefundDate = refundDate;
            saveData();
            closeModal('depositRefundModal');
            showToast('âœ… ë³´ì¦ê¸ˆ ë°˜í™˜ ì™„ë£Œ ì²˜ë¦¬ë˜ì—ˆìŠµë‹ˆë‹¤ (â‚©' + (tenant.deposit || 0).toLocaleString() + ')');
            renderTenants();
            renderDashboard();
            if (document.getElementById('tenantDetailModal')?.classList.contains('active')) {
                showTenantDetail(tenantId);
            }
        }
        // â”€â”€ ìˆ˜ë¦¬ ìš”ì²­ ì›Œí¬í”Œë¡œìš° â”€â”€
        let _maintRoomId = null;
        function openMaintenanceModal(roomId) {
            const room = appData.rooms.find(r => r.id === roomId);
            if (!room) { showToast('âš ï¸ ë°©ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            _maintRoomId = roomId;
            const building = appData.buildings.find(b => b.id === room.buildingId);
            document.getElementById('maintenanceRoomLabel').textContent = (building ? building.name + ' Â· ' : '') + room.roomNumber + 'í˜¸';
            document.getElementById('maintMemo').value = room.maintMemo || '';
            document.getElementById('maintStartDate').value = room.maintStartDate || new Date().toISOString().split('T')[0];
            document.getElementById('maintEstCost').value = room.maintEstCost || '';
            const titleEl = document.getElementById('maintenanceModalTitle');
            if (titleEl) titleEl.textContent = room.maintMemo ? 'ðŸ”§ ìˆ˜ë¦¬ ì •ë³´ ìˆ˜ì •' : 'ðŸ”§ ìˆ˜ë¦¬ ìš”ì²­';
            openModal('maintenanceModal');
        }
        function _submitMaintenance() {
            const room = appData.rooms.find(r => r.id === _maintRoomId);
            if (!room) { closeModal('maintenanceModal'); return; }
            const memo = document.getElementById('maintMemo').value.trim();
            if (!memo) { showToast('âš ï¸ ìˆ˜ë¦¬ ë‚´ìš©ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”'); return; }
            room.maintMemo = memo;
            room.maintStartDate = document.getElementById('maintStartDate').value || '';
            room.maintEstCost = parseInt(document.getElementById('maintEstCost').value) || 0;
            room.status = 'maintenance';
            saveData();
            closeModal('maintenanceModal');
            renderBuildings();
            renderDashboard();
            if (currentBuildingId === room.buildingId) showBuildingDetail(currentBuildingId);
            showToast('ðŸ”§ ìˆ˜ë¦¬ ìš”ì²­ì´ ë“±ë¡ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function openMaintenanceCompleteModal(roomId) {
            const room = appData.rooms.find(r => r.id === roomId);
            if (!room) { showToast('âš ï¸ ë°©ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
            _maintRoomId = roomId;
            const building = appData.buildings.find(b => b.id === room.buildingId);
            document.getElementById('maintCompleteRoomLabel').textContent = (building ? building.name + ' Â· ' : '') + room.roomNumber + 'í˜¸ â€” ' + (room.maintMemo || '');
            document.getElementById('maintCompleteDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('maintActualCost').value = room.maintEstCost || '';
            // ìž…ì£¼ì¤‘ ì„¸ìž…ìž ìžˆìœ¼ë©´ ê¸°ë³¸ê°’ì„ occupiedë¡œ
            const hasActiveTenant = appData.tenants.some(t => t.roomId === roomId && t.status === 'active');
            document.getElementById('maintCompleteStatus').value = hasActiveTenant ? 'occupied' : 'vacant';
            openModal('maintenanceCompleteModal');
        }
        function _submitMaintenanceComplete() {
            const room = appData.rooms.find(r => r.id === _maintRoomId);
            if (!room) { closeModal('maintenanceCompleteModal'); return; }
            const completeDate = document.getElementById('maintCompleteDate').value || new Date().toISOString().split('T')[0];
            const actualCost = parseInt(document.getElementById('maintActualCost').value) || 0;
            const newStatus = document.getElementById('maintCompleteStatus').value;
            const memoSnapshot = room.maintMemo || 'ìˆ˜ë¦¬';
            // ë¹„ìš©ì´ ìžˆìœ¼ë©´ ì§€ì¶œ ìžë™ ë“±ë¡
            if (actualCost > 0) {
                appData.expenses.push({
                    id: Date.now().toString() + '_maint',
                    buildingId: room.buildingId,
                    roomId: room.id,
                    title: 'ðŸ”§ ' + memoSnapshot,
                    amount: actualCost,
                    category: 'ìˆ˜ë¦¬ë¹„',
                    date: completeDate,
                    memo: 'ìžë™ ë“±ë¡ (ìˆ˜ë¦¬ ì™„ë£Œ)',
                    receipts: []
                });
            }
            // ìˆ˜ë¦¬ ì •ë³´ ì´ˆê¸°í™” + ìƒíƒœ ë³€ê²½
            room.status = newStatus;
            room.maintMemo = '';
            room.maintStartDate = '';
            room.maintEstCost = 0;
            saveData();
            closeModal('maintenanceCompleteModal');
            renderBuildings();
            renderDashboard();
            if (currentBuildingId === room.buildingId) showBuildingDetail(currentBuildingId);
            showToast(actualCost > 0 ? 'âœ… ìˆ˜ë¦¬ ì™„ë£Œ â€” ì§€ì¶œ â‚©' + actualCost.toLocaleString() + ' ìžë™ ë“±ë¡' : 'âœ… ìˆ˜ë¦¬ ì™„ë£Œ ì²˜ë¦¬ë˜ì—ˆìŠµë‹ˆë‹¤', 3000);
        }
        function showToast(message, durationMs) {
            var ms = durationMs == null ? 2000 : durationMs;
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.remove();
            }, ms);
        }
        function refreshCurrentPageViews() {
            if (currentPage === 'tenantsPage') {
                var pastSec = document.getElementById('pastTenantSection');
                if (pastSec && pastSec.style.display === 'block') renderPastTenants();
                else renderTenants();
            } else if (currentPage === 'rentPage') renderRents();
            else if (currentPage === 'expensesPage') {
                loadExpenseFilterRooms();
                renderExpenses();
            } else if (currentPage === 'settingsPage') _updateFirebaseSettingsUI();
        }
        function updateUI() {
            renderDashboard();
            var yd = document.getElementById('yearDisplay');
            if (yd) yd.textContent = new Date().getFullYear() + 'ë…„';
            refreshCurrentPageViews();
        }
        // Export/Import
        function exportToJSON() {
            const dataStr = JSON.stringify(appData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ìž„ëŒ€ê´€ë¦¬ì•±_' + new Date().toISOString().split('T')[0] + '.json';
            link.click();
            showToast('JSON íŒŒì¼ì´ ë‹¤ìš´ë¡œë“œë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function importFromJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        const requiredKeys = ['buildings','rooms','tenants','rents','expenses'];
                        const isValid = requiredKeys.every(k => Array.isArray(imported[k]));
                        if (!isValid) {
                            showToast('âš ï¸ ì˜¬ë°”ë¥¸ ë°±ì—… íŒŒì¼ì´ ì•„ë‹™ë‹ˆë‹¤.');
                            return;
                        }
                        appData = imported;
                        saveData();
                        updateUI();
                        showToast('âœ… ë°ì´í„°ë¥¼ ê°€ì ¸ì™”ìŠµë‹ˆë‹¤');
                    } catch (err) {
                        showToast('âš ï¸ íŒŒì¼ì„ ì½ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // ðŸ“‘ ì„¸ë¬´ ì •ë¦¬ (ì¢…í•©ì†Œë“ì„¸ ìž„ëŒ€ì†Œë“ ì‹ ê³ ìš©)
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        let _taxYear = new Date().getFullYear();
        let _taxActiveTab = 'summary';
        let _taxExcludedRents = new Set();      // ìž„ëŒ€ìˆ˜ìž…ì—ì„œ ì œì™¸í•  rent id
        let _taxExcludedExpenses = new Set();   // í•„ìš”ê²½ë¹„ì—ì„œ ì œì™¸í•  expense id
        let _taxExpenseOverride = {};           // { expenseId: 'deductible'|'non' } ì‚¬ìš©ìž ê°•ì œ ë¶„ë¥˜
        let _taxDepositRate = 3.5;              // ê°„ì£¼ìž„ëŒ€ë£Œ ì •ê¸°ì˜ˆê¸ˆì´ìžìœ¨(%) â€” ì‚¬ìš©ìž ìˆ˜ì • ê°€ëŠ¥
        // ì¹´í…Œê³ ë¦¬ë³„ ê¸°ë³¸ í•„ìš”ê²½ë¹„ ë¶„ë¥˜ (ì‚¬ìš©ìžê°€ í”½ ë³€ê²½ ê°€ëŠ¥)
        const _taxDeductibleCategories = new Set(['ìˆ˜ë¦¬ë¹„','ê´€ë¦¬ë¹„','ìž¬ì‚°ì„¸','ë³´í—˜ë£Œ','ì²­ì†Œë¹„','ì¸í…Œë¦¬ì–´','ì¤‘ê°œìˆ˜ìˆ˜ë£Œ','ê³µê³¼ê¸ˆ','ì „ê¸°ë£Œ','ìˆ˜ë„ë£Œ','ê°€ìŠ¤ë£Œ','ì„¸ê¸ˆ']);

        function openTaxFiling() {
            _taxYear = new Date().getFullYear();
            _taxActiveTab = 'summary';
            _taxExcludedRents.clear();
            _taxExcludedExpenses.clear();
            _taxExpenseOverride = {};
            openModal('taxFilingModal');
            renderTaxFiling();
        }
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // ðŸ“‘ ì„¸ê¸ˆ íŽ˜ì´ì§€ (ì „ìš© íŽ˜ì´ì§€)
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        let _taxPageDataTab = 'income';
        function openTaxPage() {
            _taxYear = _taxYear || new Date().getFullYear();
            _taxPageLoadSettings();
            renderTaxPage();
        }
        function _taxPagePrevYear() { _taxYear--; renderTaxPage(); }
        function _taxPageNextYear() { _taxYear++; renderTaxPage(); }
        function _taxPageSwitchTab(tab) {
            _taxPageDataTab = tab;
            document.querySelectorAll('#taxPage .tax-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            _renderTaxPageData();
        }
        function _taxPageLoadSettings() {
            const s = appData._taxSettings || {};
            document.getElementById('taxOwnedHouses').value = s.ownedHouses != null ? s.ownedHouses : 1;
            document.getElementById('taxIsRegistered').checked = !!s.isRegistered;
            document.getElementById('taxRegisteredTerm').value = s.registeredTerm || 'short';
            document.getElementById('taxRegisteredOptions').style.display = s.isRegistered ? 'block' : 'none';
            document.getElementById('taxOtherIncome').value = s.otherIncome || 0;
        }
        function _taxPageSaveSettings() {
            const s = {
                ownedHouses: parseInt(document.getElementById('taxOwnedHouses').value) || 1,
                isRegistered: document.getElementById('taxIsRegistered').checked,
                registeredTerm: document.getElementById('taxRegisteredTerm').value || 'short',
                otherIncome: parseInt(document.getElementById('taxOtherIncome').value) || 0
            };
            appData._taxSettings = s;
            document.getElementById('taxRegisteredOptions').style.display = s.isRegistered ? 'block' : 'none';
            saveData();
        }
        function _taxPageGetSettings() {
            const s = appData._taxSettings || {};
            return {
                ownedHouses: s.ownedHouses != null ? s.ownedHouses : 1,
                isRegistered: !!s.isRegistered,
                registeredTerm: s.registeredTerm || 'short',
                otherIncome: s.otherIncome || 0
            };
        }
        // â”€â”€ ì •ë°€ ê°„ì£¼ìž„ëŒ€ë£Œ (ì¼ë³„ ë³´ì¦ê¸ˆì ìˆ˜) â”€â”€
        function _taxComputePreciseDeemed() {
            const yearStart = new Date(_taxYear + '-01-01');
            const yearEnd = new Date(_taxYear + '-12-31');
            const yearDays = 365 + ((_taxYear % 4 === 0 && _taxYear % 100 !== 0) || _taxYear % 400 === 0 ? 1 : 0);
            const THRESHOLD = 300000000; // 3ì–µ
            let totalDepositSum = 0; // ë³´ì¦ê¸ˆì ìˆ˜ (deposit Ã— days)
            const perTenant = [];
            (appData.tenants || []).forEach(t => {
                if (!t.deposit || t.deposit <= 0) return;
                if (t._taxExcludeSmallHouse) { perTenant.push({tenant:t, days:0, sum:0, excluded:true}); return; }
                const cs = t.contractStart ? new Date(t.contractStart) : null;
                const ce = t.contractEnd ? new Date(t.contractEnd) : yearEnd;
                if (!cs) return;
                const start = cs > yearStart ? cs : yearStart;
                const end = ce < yearEnd ? ce : yearEnd;
                if (start > end) return;
                const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
                const sum = (t.deposit || 0) * days;
                totalDepositSum += sum;
                perTenant.push({tenant:t, days:days, sum:sum, deposit:t.deposit});
            });
            // ê°„ì£¼ìž„ëŒ€ë£Œ = (ë³´ì¦ê¸ˆì ìˆ˜ í•©ê³„ - 3ì–µÃ—365) Ã— 60% Ã— ì´ìžìœ¨ Ã· 365
            const thresholdSum = THRESHOLD * yearDays;
            const excessSum = Math.max(0, totalDepositSum - thresholdSum);
            const deemed = Math.round(excessSum * 0.60 * (_taxDepositRate / 100) / yearDays);
            return { yearDays, totalDepositSum, thresholdSum, excessSum, deemed, perTenant };
        }
        // â”€â”€ ì‹ ê³  ì˜ë¬´ íŒì • â”€â”€
        function _taxComputeFilingReq() {
            const s = _taxPageGetSettings();
            const inc = _taxCollectIncome();
            const totalRent = inc.totalIncluded;
            if (s.ownedHouses <= 0) return { status: 'exempt', text: 'ë³´ìœ  ì£¼íƒ 0ê°œ â€” ìž„ëŒ€ì†Œë“ì„¸ ëŒ€ìƒ ì•„ë‹˜' };
            if (s.ownedHouses === 1) {
                // 1ì£¼íƒìž: ì›”ì„¸ 0ì´ë©´ ë¹„ê³¼ì„¸ (ê¸°ì¤€ì‹œê°€ 9ì–µ ì´í•˜ + êµ­ì™¸ì£¼íƒ ì•„ë‹˜), ì›”ì„¸ ë°›ìœ¼ë©´ ê³¼ì„¸
                if (totalRent === 0) return { status: 'exempt', text: '1ì£¼íƒìž + ì›”ì„¸ ìˆ˜ìž… ì—†ìŒ â†’ ë¹„ê³¼ì„¸ (ê¸°ì¤€ì‹œê°€ 9ì–µ ì´ˆê³¼ / êµ­ì™¸ì£¼íƒ ì‹œ ê³¼ì„¸)' };
                return { status: 'required', text: '1ì£¼íƒìž + ì›”ì„¸ ìˆ˜ìž… ë°œìƒ â†’ ì‹ ê³  ì˜ë¬´ (ê¸°ì¤€ì‹œê°€ 9ì–µ ì´í•˜ë©´ ë¹„ê³¼ì„¸ ê°€ëŠ¥ â€” ë³¸ì¸ í™•ì¸ í•„ìš”)' };
            }
            // 2ì£¼íƒ ì´ìƒ
            if (totalRent <= 20000000) return { status: 'optional', text: '2ì£¼íƒ ì´ìƒ + ìž„ëŒ€ìˆ˜ìž… 2,000ë§Œ ì´í•˜ â†’ ë¶„ë¦¬ê³¼ì„¸ / ì¢…í•©ê³¼ì„¸ ì„ íƒ ê°€ëŠ¥' };
            return { status: 'required', text: '2ì£¼íƒ ì´ìƒ + ìž„ëŒ€ìˆ˜ìž… 2,000ë§Œ ì´ˆê³¼ â†’ ì¢…í•©ê³¼ì„¸ ì˜ë¬´' };
        }
        // â”€â”€ ë¶„ë¦¬ê³¼ì„¸ ì„¸ì•¡ ê³„ì‚° â”€â”€
        function _taxComputeSeparateTax() {
            const s = _taxPageGetSettings();
            const inc = _taxCollectIncome();
            const dep = _taxComputePreciseDeemed();
            const grossIncome = inc.totalIncluded + dep.deemed;
            // ë¶„ë¦¬ê³¼ì„¸ í•„ìš”ê²½ë¹„ìœ¨
            const necessaryRate = s.isRegistered ? 0.60 : 0.50;
            const necessaryExp = Math.round(grossIncome * necessaryRate);
            // ê¸°ë³¸ê³µì œ
            const basicDeduction = s.isRegistered ? 4000000 : 2000000;
            const taxBase = Math.max(0, grossIncome - necessaryExp - basicDeduction);
            let tax = Math.round(taxBase * 0.14); // 14% ì„¸ìœ¨
            // ë“±ë¡ìž„ëŒ€ ê°ë©´
            let discountRate = 0;
            if (s.isRegistered) {
                if (s.registeredTerm === 'long') discountRate = 0.75;
                else if (s.registeredTerm === 'long_joint') discountRate = 0.50;
                else discountRate = 0.30;
            }
            const discount = Math.round(tax * discountRate);
            const finalTax = tax - discount;
            const localTax = Math.round(finalTax * 0.10); // ì§€ë°©ì†Œë“ì„¸ 10%
            return { grossIncome, necessaryExp, basicDeduction, taxBase, tax, discount, finalTax, localTax, total: finalTax + localTax };
        }
        // â”€â”€ ì¢…í•©ê³¼ì„¸ ì„¸ì•¡ (ë‹¨ìˆœ ì¶”ì •) â”€â”€
        function _taxComputeCombinedTax() {
            const s = _taxPageGetSettings();
            const inc = _taxCollectIncome();
            const exp = _taxCollectExpenses();
            const dep = _taxComputePreciseDeemed();
            const rentalIncome = Math.max(0, inc.totalIncluded + dep.deemed - exp.deductibleTotal);
            const totalIncome = rentalIncome + (s.otherIncome || 0);
            // ì¢…í•©ì†Œë“ì„¸ ëˆ„ì§„ì„¸ìœ¨ (2024ë…„ ê¸°ì¤€)
            const tax = _taxProgressiveTax(totalIncome);
            // ìž„ëŒ€ ë¶€ë¶„ë§Œ ë¶„ë¦¬í•´ì„œ í‘œì‹œ
            const taxIfOnlyOther = _taxProgressiveTax(s.otherIncome || 0);
            const rentalPortionTax = Math.max(0, tax - taxIfOnlyOther);
            const localTax = Math.round(rentalPortionTax * 0.10);
            return { rentalIncome, totalIncome, totalTax: tax, rentalPortionTax, localTax, total: rentalPortionTax + localTax };
        }
        function _taxProgressiveTax(income) {
            if (income <= 0) return 0;
            if (income <= 14000000) return Math.round(income * 0.06);
            if (income <= 50000000) return Math.round(840000 + (income - 14000000) * 0.15);
            if (income <= 88000000) return Math.round(6240000 + (income - 50000000) * 0.24);
            if (income <= 150000000) return Math.round(15360000 + (income - 88000000) * 0.35);
            if (income <= 300000000) return Math.round(37060000 + (income - 150000000) * 0.38);
            if (income <= 500000000) return Math.round(94060000 + (income - 300000000) * 0.40);
            if (income <= 1000000000) return Math.round(174060000 + (income - 500000000) * 0.42);
            return Math.round(384060000 + (income - 1000000000) * 0.45);
        }
        // â”€â”€ ì„¸ê¸ˆ ìº˜ë¦°ë” â”€â”€
        function _taxComputeCalendar() {
            const today = new Date();
            const events = [
                { name: 'ì¢…í•©ì†Œë“ì„¸ ì‹ ê³ ', date: _taxYear + '-05-31', icon: 'ðŸ“‘', forYear: _taxYear - 1, key: 'income' },
                { name: 'ë¶€ê°€ê°€ì¹˜ì„¸ ì‹ ê³  (1ê¸° í™•ì •)', date: _taxYear + '-07-25', icon: 'ðŸ’¼', forYear: _taxYear, key: 'vat1' },
                { name: 'ìž¬ì‚°ì„¸ (ì£¼íƒë¶„ 1/2)', date: _taxYear + '-07-31', icon: 'ðŸ ', forYear: _taxYear, key: 'prop1' },
                { name: 'ìž¬ì‚°ì„¸ (ì£¼íƒë¶„ 1/2 + í† ì§€)', date: _taxYear + '-09-30', icon: 'ðŸ ', forYear: _taxYear, key: 'prop2' },
                { name: 'ë¶€ê°€ê°€ì¹˜ì„¸ ì‹ ê³  (2ê¸° ì˜ˆì •)', date: _taxYear + '-10-25', icon: 'ðŸ’¼', forYear: _taxYear, key: 'vat2' },
                { name: 'ì¢…í•©ë¶€ë™ì‚°ì„¸ ë‚©ë¶€', date: _taxYear + '-12-15', icon: 'ðŸ›ï¸', forYear: _taxYear, key: 'gjong' },
                { name: 'ë¶€ê°€ê°€ì¹˜ì„¸ ì‹ ê³  (2ê¸° í™•ì •)', date: (_taxYear+1) + '-01-25', icon: 'ðŸ’¼', forYear: _taxYear, key: 'vat3' }
            ];
            events.forEach(e => {
                const d = new Date(e.date);
                const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
                e.dday = diff;
            });
            return events;
        }
        // â”€â”€ ì‹ ê³  ì „ ì²´í¬ë¦¬ìŠ¤íŠ¸ â”€â”€
        function _taxComputeChecklist() {
            const yp = _taxYearPrefix();
            const items = [];
            // 1. ë¯¸ë‚© ì›”ì„¸ í™•ì¸
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            const unpaidThisYear = (appData.rents || []).filter(r => r.month && r.month.startsWith(yp) && (r.status === 'pending' || r.status === 'overdue'));
            if (unpaidThisYear.length > 0) items.push({ status: 'warn', text: `ë¯¸ë‚© ì²˜ë¦¬ë˜ì§€ ì•Šì€ ì›”ì„¸ ê¸°ë¡ì´ ${unpaidThisYear.length}ê±´ ìžˆìŠµë‹ˆë‹¤ â€” ì‹¤ì œ ìˆ˜ë‚© ì—¬ë¶€ í™•ì¸` });
            else items.push({ status: 'ok', text: `${_taxYear}ë…„ ì›”ì„¸ ìˆ˜ë‚© ìƒíƒœ ì •ìƒ` });
            // 2. partial ë¯¸í•´ê²°
            const partialThisYear = (appData.rents || []).filter(r => r.month && r.month.startsWith(yp) && r.status === 'partial');
            if (partialThisYear.length > 0) items.push({ status: 'warn', text: `ë¶€ë¶„ë‚©ë¶€ ìƒíƒœ ê¸°ë¡ ${partialThisYear.length}ê±´ â€” ìž”ì•¡ ì²˜ë¦¬ í™•ì¸` });
            // 3. ì˜ìˆ˜ì¦ ì—†ëŠ” ì§€ì¶œ
            const expWithoutReceipt = (appData.expenses || []).filter(e => e.date && e.date.startsWith(yp) && (!e.receipts || e.receipts.length === 0));
            if (expWithoutReceipt.length > 0) items.push({ status: 'warn', text: `ì˜ìˆ˜ì¦ ë¯¸ì²¨ë¶€ ì§€ì¶œì´ ${expWithoutReceipt.length}ê±´ â€” ì„¸ë¬´ì¡°ì‚¬ ëŒ€ë¹„ ì²¨ë¶€ ê¶Œìž¥` });
            else if ((appData.expenses || []).filter(e => e.date && e.date.startsWith(yp)).length > 0) items.push({ status: 'ok', text: 'ëª¨ë“  ì§€ì¶œì— ì˜ìˆ˜ì¦ ì²¨ë¶€ë¨' });
            // 4. ì¹´í…Œê³ ë¦¬ ë¯¸ë¶„ë¥˜ ì§€ì¶œ
            const uncategorized = (appData.expenses || []).filter(e => e.date && e.date.startsWith(yp) && (!e.category || e.category === 'ê¸°íƒ€'));
            if (uncategorized.length > 0) items.push({ status: 'warn', text: `'ê¸°íƒ€' ë˜ëŠ” ë¯¸ë¶„ë¥˜ ì§€ì¶œì´ ${uncategorized.length}ê±´ â€” ì •í™•í•œ ë¶„ë¥˜ ê¶Œìž¥` });
            // 5. ì„¸ìž…ìž ì£¼ë¯¼ë²ˆí˜¸ ëˆ„ë½
            const tenantsWithoutRid = (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart && !t.residentId;
            });
            if (tenantsWithoutRid.length > 0) items.push({ status: 'warn', text: `ì£¼ë¯¼ë²ˆí˜¸ ë¯¸ìž…ë ¥ ì„¸ìž…ìž ${tenantsWithoutRid.length}ëª… â€” ì‹ ê³ ì„œ ìž‘ì„± ì‹œ í•„ìš”` });
            // 6. ì„¸ë¬´ ì„¤ì • ë¯¸ìž…ë ¥
            const s = _taxPageGetSettings();
            if (!appData._taxSettings) items.push({ status: 'bad', text: 'ì„¸ë¬´ ì„¤ì •(ë³´ìœ  ì£¼íƒ ìˆ˜ ë“±)ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”' });
            return items;
        }
        // â”€â”€ ì—°ë„ë³„ ì¶”ì´ â”€â”€
        function _taxComputeTrend() {
            const years = [];
            for (let i = 4; i >= 0; i--) {
                const y = _taxYear - i;
                const yp = y + '-';
                const inc = (appData.rents || []).filter(r => r.status === 'paid' && r.month && r.month.startsWith(yp) && (!r.type || r.type === 'monthly'))
                    .reduce((s,r) => s + (r.amount || 0), 0);
                const exp = (appData.expenses || []).filter(e => e.date && e.date.startsWith(yp))
                    .reduce((s,e) => s + (e.amount || 0), 0);
                years.push({ year: y, income: inc, expense: exp, profit: inc - exp });
            }
            return years;
        }
        // â”€â”€ íŽ˜ì´ì§€ ì „ì²´ ë Œë”ë§ â”€â”€
        function renderTaxPage() {
            document.getElementById('taxPageYearLabel').textContent = _taxYear + 'ë…„';
            // ì„¸ë¬´ ì„¤ì • ìš”ì•½
            const s = _taxPageGetSettings();
            const setupSum = document.getElementById('taxSetupSummary');
            if (setupSum) {
                let txt = s.ownedHouses + 'ì£¼íƒ';
                if (s.isRegistered) txt += ' Â· ë“±ë¡ìž„ëŒ€';
                if (s.otherIncome > 0) txt += ' Â· ë‹¤ë¥¸ì†Œë“ â‚©' + s.otherIncome.toLocaleString();
                setupSum.textContent = txt;
            }
            _renderTaxFilingReqCard();
            _renderTaxSimulationCard();
            _renderTaxIncomeFinalCard();
            _renderTaxCalendarCard();
            _renderTaxChecklistCard();
            _renderTaxDeemedCard();
            _renderTaxTrendCard();
            _renderTaxPageData();
        }
        function _renderTaxFilingReqCard() {
            const req = _taxComputeFilingReq();
            const cls = req.status === 'exempt' ? 'tax-req-exempt' : (req.status === 'optional' ? 'tax-req-optional' : 'tax-req-required');
            const icon = req.status === 'exempt' ? 'âœ…' : (req.status === 'optional' ? 'âš–ï¸' : 'âš ï¸');
            const label = req.status === 'exempt' ? 'ì‹ ê³  ì˜ë¬´ ì—†ìŒ' : (req.status === 'optional' ? 'ì‹ ê³  ì„ íƒ ê°€ëŠ¥' : 'ì‹ ê³  ì˜ë¬´ ìžˆìŒ');
            document.getElementById('taxFilingReqCard').innerHTML =
                '<div class="tax-page-card-title">ðŸŽ¯ ì‹ ê³  ì˜ë¬´ íŒì •</div>'
                + '<div class="tax-req-card ' + cls + '">' + icon + ' <strong>' + label + '</strong><br><span style="font-weight:500;font-size:12px;">' + req.text + '</span></div>';
        }
        function _renderTaxSimulationCard() {
            const sep = _taxComputeSeparateTax();
            const comb = _taxComputeCombinedTax();
            const sepBetter = sep.total < comb.total;
            const diff = Math.abs(sep.total - comb.total);
            const s = _taxPageGetSettings();
            const inc = _taxCollectIncome();
            const expData = _taxCollectExpenses();
            const dep = _taxComputePreciseDeemed();
            const grossIncome = inc.totalIncluded + dep.deemed;
            // í‘œì¤€ê³µì œ vs ì‹¤ì œê²½ë¹„
            const standardDed = Math.round(grossIncome * (s.isRegistered ? 0.60 : 0.50));
            const realExp = expData.deductibleTotal;
            const realBetter = realExp > standardDed;
            document.getElementById('taxSimulationCard').innerHTML =
                '<div class="tax-page-card-title">ðŸ’° ì ˆì„¸ ì‹œë®¬ë ˆì´ì…˜ <span class="pill">ìžë™ ì¶”ì²œ</span></div>'
                + '<div class="tax-sim-grid">'
                + '  <div class="tax-sim-card' + (sepBetter ? ' recommended' : '') + '">'
                + '    <div class="tax-sim-label">ë¶„ë¦¬ê³¼ì„¸' + (sepBetter ? '<span class="tax-sim-badge">ìœ ë¦¬</span>' : '') + '</div>'
                + '    <div class="tax-sim-amount">â‚©' + sep.total.toLocaleString() + '</div>'
                + '    <div style="font-size:10px;color:#94A3B8;margin-top:2px;">14% + ì§€ë°©ì„¸</div>'
                + '  </div>'
                + '  <div class="tax-sim-card' + (!sepBetter ? ' recommended' : '') + '">'
                + '    <div class="tax-sim-label">ì¢…í•©ê³¼ì„¸' + (!sepBetter ? '<span class="tax-sim-badge">ìœ ë¦¬</span>' : '') + '</div>'
                + '    <div class="tax-sim-amount">â‚©' + comb.total.toLocaleString() + '</div>'
                + '    <div style="font-size:10px;color:#94A3B8;margin-top:2px;">ëˆ„ì§„ 6~45%</div>'
                + '  </div>'
                + '</div>'
                + (inc.totalIncluded <= 20000000
                    ? '<div style="font-size:11px;color:#0F766E;margin-top:8px;padding:6px 10px;background:#F0FDFA;border-radius:6px;">ðŸ’¡ ìž„ëŒ€ìˆ˜ìž… 2,000ë§Œ ì´í•˜ â†’ ' + (sepBetter ? 'ë¶„ë¦¬ê³¼ì„¸' : 'ì¢…í•©ê³¼ì„¸') + 'ê°€ ì•½ <strong>â‚©' + diff.toLocaleString() + '</strong> ìœ ë¦¬í•©ë‹ˆë‹¤</div>'
                    : '<div style="font-size:11px;color:#92400E;margin-top:8px;padding:6px 10px;background:#FFFBEB;border-radius:6px;">âš ï¸ ìž„ëŒ€ìˆ˜ìž… 2,000ë§Œ ì´ˆê³¼ â†’ ì¢…í•©ê³¼ì„¸ ì˜ë¬´</div>')
                + '<div style="border-top:1px dashed #E2E8F0;margin:12px 0 10px;"></div>'
                + '<div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:6px;">ðŸ“Œ í‘œì¤€ê³µì œ vs ì‹¤ì œ í•„ìš”ê²½ë¹„</div>'
                + '<div class="tax-sim-grid">'
                + '  <div class="tax-sim-card' + (!realBetter ? ' recommended' : '') + '"><div class="tax-sim-label">í‘œì¤€ê³µì œ' + (!realBetter ? '<span class="tax-sim-badge">ìœ ë¦¬</span>' : '') + '</div><div class="tax-sim-amount">â‚©' + standardDed.toLocaleString() + '</div><div style="font-size:10px;color:#94A3B8;">' + (s.isRegistered ? '60%' : '50%') + ' ë¹„ìœ¨</div></div>'
                + '  <div class="tax-sim-card' + (realBetter ? ' recommended' : '') + '"><div class="tax-sim-label">ì‹¤ì œ ê²½ë¹„' + (realBetter ? '<span class="tax-sim-badge">ìœ ë¦¬</span>' : '') + '</div><div class="tax-sim-amount">â‚©' + realExp.toLocaleString() + '</div><div style="font-size:10px;color:#94A3B8;">ë¶„ë¥˜ í•­ëª© í•©ê³„</div></div>'
                + '</div>'
                + (s.isRegistered
                    ? '<div style="font-size:11px;color:#0F766E;margin-top:8px;padding:6px 10px;background:#F0FDFA;border-radius:6px;">ðŸ›ï¸ ë“±ë¡ìž„ëŒ€ ê°ë©´ ì ìš© â€” ì„¸ì•¡ ' + (sep.discount > 0 ? 'â‚©' + sep.discount.toLocaleString() + ' ê°ë©´' : 'ì—†ìŒ') + '</div>'
                    : '<div style="font-size:11px;color:#64748B;margin-top:8px;padding:6px 10px;background:#F8FAFC;border-radius:6px;">ðŸ’¡ ì£¼íƒìž„ëŒ€ì‚¬ì—…ìž ë“±ë¡ ì‹œ ì„¸ì•¡ 30~75% ê°ë©´ ê°€ëŠ¥ (ì„¸ë¬´ ì„¤ì •ì—ì„œ í† ê¸€)</div>');
        }
        function _renderTaxIncomeFinalCard() {
            const inc = _taxCollectIncome();
            const dep = _taxComputePreciseDeemed();
            const expData = _taxCollectExpenses();
            const taxBase = inc.totalIncluded + dep.deemed - expData.deductibleTotal;
            document.getElementById('taxIncomeFinalCard').className = 'tax-page-card tax-income-final';
            document.getElementById('taxIncomeFinalCard').innerHTML =
                '<div class="label">ðŸ“Š ìž„ëŒ€ì†Œë“ê¸ˆì•¡ (' + _taxYear + 'ë…„)</div>'
                + '<div class="amount">â‚©' + taxBase.toLocaleString() + '</div>'
                + '<div class="breakdown">ìˆ˜ìž… â‚©' + inc.totalIncluded.toLocaleString() + ' + ê°„ì£¼ â‚©' + dep.deemed.toLocaleString() + ' âˆ’ ê²½ë¹„ â‚©' + expData.deductibleTotal.toLocaleString() + '</div>';
        }
        function _renderTaxCalendarCard() {
            const events = _taxComputeCalendar().filter(e => e.dday >= -30); // ì§€ë‚œ ê²ƒ 30ì¼ê¹Œì§€ë§Œ
            let html = '<div class="tax-page-card-title">ðŸ“… ì„¸ê¸ˆ ìº˜ë¦°ë”</div>';
            if (events.length === 0) {
                html += '<div style="color:#94A3B8;font-size:12px;padding:8px 0;text-align:center;">í•´ë‹¹ ì—°ë„ì˜ ì„¸ê¸ˆ ì¼ì •ì´ ëª¨ë‘ ì§€ë‚¬ìŠµë‹ˆë‹¤.</div>';
            } else {
                events.forEach(e => {
                    const ddayCls = e.dday < 0 ? 'done' : (e.dday <= 7 ? 'urgent' : (e.dday <= 30 ? 'soon' : 'normal'));
                    const ddayTxt = e.dday < 0 ? 'ì™„ë£Œ' : (e.dday === 0 ? 'ì˜¤ëŠ˜' : 'D-' + e.dday);
                    html += '<div class="tax-cal-row">'
                         + '  <div class="tax-cal-icon" style="background:#F0FDFA;">' + e.icon + '</div>'
                         + '  <div class="tax-cal-body"><div class="tax-cal-name">' + e.name + '</div><div class="tax-cal-date">' + e.date + (e.forYear ? ' Â· ' + e.forYear + 'ë…„ ê·€ì†' : '') + '</div></div>'
                         + '  <span class="tax-cal-dday ' + ddayCls + '">' + ddayTxt + '</span>'
                         + '</div>';
                });
            }
            document.getElementById('taxCalendarCard').innerHTML = html;
        }
        function _renderTaxChecklistCard() {
            const items = _taxComputeChecklist();
            let html = '<div class="tax-page-card-title">âœ… ì‹ ê³  ì „ ì²´í¬ë¦¬ìŠ¤íŠ¸</div>';
            if (items.length === 0) {
                html += '<div style="color:#16A34A;font-size:13px;padding:8px 0;text-align:center;">âœ¨ ëª¨ë“  í•­ëª©ì´ ì •ìƒìž…ë‹ˆë‹¤!</div>';
            } else {
                items.forEach(it => {
                    const icon = it.status === 'ok' ? 'âœ“' : (it.status === 'warn' ? 'âš ï¸' : 'â—');
                    html += '<div class="tax-check-row ' + it.status + '"><span class="tax-check-icon">' + icon + '</span><span>' + it.text + '</span></div>';
                });
            }
            document.getElementById('taxChecklistCard').innerHTML = html;
        }
        function _renderTaxDeemedCard() {
            const dep = _taxComputePreciseDeemed();
            let html = '<div class="tax-page-card-title">ðŸ¦ ê°„ì£¼ìž„ëŒ€ë£Œ (ì •ë°€ ê³„ì‚°)</div>'
                + '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span>ë³´ì¦ê¸ˆì ìˆ˜ í•©ê³„ (ë³´ì¦ê¸ˆÃ—ì¼ìˆ˜)</span><span style="font-weight:700;">â‚©' + dep.totalDepositSum.toLocaleString() + '</span></div>'
                + '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span>3ì–µ Ã—' + dep.yearDays + 'ì¼ ì°¨ê°</span><span style="font-weight:700;">âˆ’â‚©' + dep.thresholdSum.toLocaleString() + '</span></div>'
                + '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-top:1px solid #F1F5F9;margin-top:4px;"><span>ì´ˆê³¼ë¶„</span><span style="font-weight:700;">â‚©' + dep.excessSum.toLocaleString() + '</span></div>'
                + '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px;gap:8px;"><span>ì •ê¸°ì˜ˆê¸ˆ ì´ìžìœ¨ (%)</span><input type="number" step="0.1" min="0" max="20" value="' + _taxDepositRate + '" onchange="_taxUpdateRate(this.value);renderTaxPage();" style="width:80px;padding:6px 8px;border:1px solid #E2E8F0;border-radius:6px;text-align:right;"></div>'
                + '<div style="display:flex;justify-content:space-between;padding:10px;background:#F0FDFA;border-radius:8px;font-weight:800;font-size:14px;margin-top:6px;"><span>ðŸ“Œ ê°„ì£¼ìž„ëŒ€ë£Œ</span><span style="color:#0F766E;">â‚©' + dep.deemed.toLocaleString() + '</span></div>'
                + '<div style="font-size:11px;color:#94A3B8;margin-top:6px;line-height:1.5;">ê³„ì‚°: (ë³´ì¦ê¸ˆì ìˆ˜ âˆ’ 3ì–µÃ—' + dep.yearDays + 'ì¼) Ã— 60% Ã— ' + _taxDepositRate + '% Ã· ' + dep.yearDays + '<br>â€» ì†Œí˜•ì£¼íƒ(40ãŽ¡â†“ ê¸°ì¤€ì‹œê°€ 2ì–µâ†“) ì œì™¸ ê°€ëŠ¥ â€” ì„¸ìž…ìž ìƒì„¸ì—ì„œ í† ê¸€ (ì¶”í›„)</div>';
            document.getElementById('taxDeemedCard').innerHTML = html;
        }
        function _renderTaxTrendCard() {
            const years = _taxComputeTrend();
            const maxVal = Math.max.apply(null, years.flatMap(y => [Math.abs(y.income), Math.abs(y.expense), Math.abs(y.profit)])) || 1;
            const cols = years.map(y => {
                const incH = Math.max(2, Math.round(Math.abs(y.income) / maxVal * 70));
                const expH = Math.max(2, Math.round(Math.abs(y.expense) / maxVal * 70));
                const profH = Math.max(2, Math.round(Math.abs(y.profit) / maxVal * 70));
                return '<div class="tax-trend-bar-group">'
                     + '  <div class="tax-trend-bars">'
                     + '    <div class="tax-trend-bar income" style="height:' + incH + 'px;" title="ìˆ˜ìž… â‚©' + y.income.toLocaleString() + '"></div>'
                     + '    <div class="tax-trend-bar expense" style="height:' + expH + 'px;" title="ì§€ì¶œ â‚©' + y.expense.toLocaleString() + '"></div>'
                     + '    <div class="tax-trend-bar profit" style="height:' + profH + 'px;" title="ìˆœìµ â‚©' + y.profit.toLocaleString() + '"></div>'
                     + '  </div>'
                     + '  <div class="tax-trend-label">' + y.year + '</div>'
                     + '</div>';
            }).join('');
            document.getElementById('taxTrendCard').innerHTML = '<div class="tax-page-card-title">ðŸ“ˆ ì—°ë„ë³„ ì¶”ì´ (ìµœê·¼ 5ë…„)</div>'
                + '<div style="display:flex;gap:8px;align-items:flex-end;justify-content:space-around;padding:0 4px;">' + cols + '</div>'
                + '<div style="display:flex;gap:10px;justify-content:center;margin-top:10px;font-size:11px;color:#64748B;">'
                + '<span><span style="display:inline-block;width:10px;height:10px;background:#0EA5A4;border-radius:2px;vertical-align:middle;"></span> ìˆ˜ìž…</span>'
                + '<span><span style="display:inline-block;width:10px;height:10px;background:#DC2626;border-radius:2px;vertical-align:middle;"></span> ì§€ì¶œ</span>'
                + '<span><span style="display:inline-block;width:10px;height:10px;background:#1E40AF;border-radius:2px;vertical-align:middle;"></span> ìˆœìµ</span>'
                + '</div>';
        }
        function _renderTaxPageData() {
            const el = document.getElementById('taxPageDataContent');
            if (!el) return;
            if (_taxPageDataTab === 'income') el.innerHTML = _renderTaxIncome();
            else if (_taxPageDataTab === 'expense') el.innerHTML = _renderTaxExpense();
            else if (_taxPageDataTab === 'tenants') el.innerHTML = _renderTaxTenants();
        }
        // ë³€ê²½ëœ í† ê¸€ì´ íŽ˜ì´ì§€ì—ë„ ì˜í–¥ ì£¼ë„ë¡ ê¸°ì¡´ _taxToggle* í•¨ìˆ˜ì—ì„œë„ íŽ˜ì´ì§€ ìž¬ë Œë”
        const _origRenderTaxFiling = renderTaxFiling;
        renderTaxFiling = function() {
            _origRenderTaxFiling();
            // í˜„ìž¬ íŽ˜ì´ì§€ê°€ taxPageë¼ë©´ ê°™ì´ ê°±ì‹ 
            if (document.getElementById('taxPage') && document.getElementById('taxPage').classList.contains('active')) {
                renderTaxPage();
            }
        };
        // â”€â”€ ì„¸ë¬´ì‚¬ ì „ë‹¬ìš© ë¬¶ìŒ PDF â”€â”€
        function printTaxBundleForAccountant() {
            const inc = _taxCollectIncome();
            const exp = _taxCollectExpenses();
            const dep = _taxComputePreciseDeemed();
            const sep = _taxComputeSeparateTax();
            const comb = _taxComputeCombinedTax();
            const req = _taxComputeFilingReq();
            const s = _taxPageGetSettings();
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            const tenants = (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart;
            });
            const taxBase = inc.totalIncluded + dep.deemed - exp.deductibleTotal;
            let html = '<html><head><meta charset="utf-8"><title>' + _taxYear + 'ë…„ ìž„ëŒ€ì†Œë“ ì„¸ë¬´ ìžë£Œ (ì„¸ë¬´ì‚¬ìš©)</title>'
                + '<style>body{font-family:"Malgun Gothic",sans-serif;margin:0;padding:24px;color:#1E293B;}'
                + 'h1{font-size:22px;margin:0 0 4px;color:#0F766E;}h2{font-size:16px;margin:24px 0 10px;border-bottom:2.5px solid #0F766E;padding-bottom:6px;color:#0F766E;}'
                + 'h3{font-size:13px;margin:14px 0 6px;color:#475569;}'
                + 'table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px;}'
                + 'th,td{border:1px solid #CBD5E1;padding:6px 8px;text-align:left;vertical-align:top;}'
                + 'th{background:#F1F5F9;font-weight:700;}'
                + '.total-row{background:#F0FDFA;font-weight:700;}'
                + '.summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0;}'
                + '.summary-card{border:1px solid #CBD5E1;border-radius:6px;padding:10px;}'
                + '.summary-label{font-size:10px;color:#64748B;margin-bottom:4px;font-weight:700;}'
                + '.summary-amt{font-size:15px;font-weight:800;}'
                + '.final{background:#0F766E;color:white;padding:14px;border-radius:8px;text-align:center;margin:12px 0;}'
                + '.final .summary-amt{font-size:24px;color:white;}'
                + '.final .summary-label{color:rgba(255,255,255,0.85);}'
                + '.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12px;}'
                + '.info-item{padding:6px 10px;background:#F8FAFC;border-radius:6px;}'
                + '.info-label{color:#64748B;font-size:10px;}'
                + '.info-val{font-weight:700;}'
                + '.page-break{page-break-before:always;}'
                + '.receipt-img{max-width:100%;max-height:300px;border:1px solid #CBD5E1;border-radius:6px;margin:4px 0;display:block;}'
                + '@media print{body{padding:12px;}}</style></head><body>';
            html += '<h1>ðŸ“‘ ' + _taxYear + 'ë…„ ì¢…í•©ì†Œë“ì„¸ ìž„ëŒ€ì†Œë“ ì‹ ê³  ìžë£Œ</h1>';
            html += '<div style="font-size:11px;color:#64748B;margin-bottom:12px;">ìƒì„±ì¼: ' + new Date().toISOString().split('T')[0] + ' Â· ì„¸ë¬´ì‚¬ ì „ë‹¬ìš© ì¢…í•© ìžë£Œ</div>';

            // 1. ì‹ ê³  ìš”ì•½
            html += '<h2>1. ì‹ ê³  ê°œìš”</h2>';
            html += '<div class="info-grid">'
                  + '<div class="info-item"><div class="info-label">ì‹ ê³  ì˜ë¬´</div><div class="info-val">' + req.text + '</div></div>'
                  + '<div class="info-item"><div class="info-label">ë³´ìœ  ì£¼íƒ ìˆ˜</div><div class="info-val">' + s.ownedHouses + 'ì£¼íƒ</div></div>'
                  + '<div class="info-item"><div class="info-label">ìž„ëŒ€ì‚¬ì—…ìž ë“±ë¡</div><div class="info-val">' + (s.isRegistered ? 'ë“±ë¡ (' + (s.registeredTerm === 'long' ? '8ë…„ ìž¥ê¸°' : (s.registeredTerm === 'long_joint' ? '8ë…„ ê³µë™' : '4ë…„ ë‹¨ê¸°')) + ')' : 'ë¯¸ë“±ë¡') + '</div></div>'
                  + '<div class="info-item"><div class="info-label">ëŒ€ìƒ ì„¸ìž…ìž</div><div class="info-val">' + tenants.length + 'ëª…</div></div>'
                  + '</div>';

            html += '<h2>2. ìµœì¢… ìž„ëŒ€ì†Œë“ê¸ˆì•¡</h2>';
            html += '<div class="summary-grid">'
                  + '<div class="summary-card"><div class="summary-label">ìž„ëŒ€ìˆ˜ìž…</div><div class="summary-amt">â‚©' + inc.totalIncluded.toLocaleString() + '</div></div>'
                  + '<div class="summary-card"><div class="summary-label">ê°„ì£¼ìž„ëŒ€ë£Œ (ì •ë°€)</div><div class="summary-amt">â‚©' + dep.deemed.toLocaleString() + '</div></div>'
                  + '<div class="summary-card"><div class="summary-label">í•„ìš”ê²½ë¹„</div><div class="summary-amt">â‚©' + exp.deductibleTotal.toLocaleString() + '</div></div>'
                  + '</div>';
            html += '<div class="final"><div class="summary-label">ðŸ“Š ìž„ëŒ€ì†Œë“ê¸ˆì•¡</div><div class="summary-amt">â‚©' + taxBase.toLocaleString() + '</div></div>';

            html += '<h2>3. ì ˆì„¸ ì‹œë®¬ë ˆì´ì…˜</h2>';
            html += '<table><tr><th>ë°©ì‹</th><th>ë³¸ì„¸</th><th>ì§€ë°©ì„¸</th><th>ì„¸ì•¡ í•©ê³„</th><th>ë¹„ê³ </th></tr>'
                  + '<tr><td>ë¶„ë¦¬ê³¼ì„¸</td><td style="text-align:right;">â‚©' + sep.finalTax.toLocaleString() + '</td><td style="text-align:right;">â‚©' + sep.localTax.toLocaleString() + '</td><td style="text-align:right;font-weight:700;">â‚©' + sep.total.toLocaleString() + '</td><td>14% + ë“±ë¡ê°ë©´ ' + (sep.discount > 0 ? 'âˆ’â‚©' + sep.discount.toLocaleString() : 'ì—†ìŒ') + '</td></tr>'
                  + '<tr><td>ì¢…í•©ê³¼ì„¸</td><td style="text-align:right;">â‚©' + comb.rentalPortionTax.toLocaleString() + '</td><td style="text-align:right;">â‚©' + comb.localTax.toLocaleString() + '</td><td style="text-align:right;font-weight:700;">â‚©' + comb.total.toLocaleString() + '</td><td>ëˆ„ì§„ (ë‹¤ë¥¸ì†Œë“ â‚©' + (s.otherIncome||0).toLocaleString() + ' í¬í•¨)</td></tr>'
                  + '</table>';

            html += '<h2>4. ê°„ì£¼ìž„ëŒ€ë£Œ ì •ë°€ ê³„ì‚°</h2>';
            html += '<table><tr><th>ì„¸ìž…ìž</th><th>ë³´ì¦ê¸ˆ</th><th>ìž„ëŒ€ì¼ìˆ˜</th><th>ë³´ì¦ê¸ˆì ìˆ˜</th></tr>';
            dep.perTenant.forEach(p => {
                if (p.excluded) return;
                html += '<tr><td>' + (p.tenant.name||'') + '</td><td style="text-align:right;">â‚©' + (p.deposit||0).toLocaleString() + '</td><td style="text-align:right;">' + p.days + 'ì¼</td><td style="text-align:right;">â‚©' + p.sum.toLocaleString() + '</td></tr>';
            });
            html += '<tr class="total-row"><td colspan="3">ë³´ì¦ê¸ˆì ìˆ˜ í•©ê³„</td><td style="text-align:right;">â‚©' + dep.totalDepositSum.toLocaleString() + '</td></tr>';
            html += '<tr><td colspan="3">3ì–µ Ã— ' + dep.yearDays + 'ì¼ ì°¨ê°</td><td style="text-align:right;">âˆ’â‚©' + dep.thresholdSum.toLocaleString() + '</td></tr>';
            html += '<tr class="total-row"><td colspan="3">ì´ˆê³¼ë¶„ Ã— 60% Ã— ' + _taxDepositRate + '% Ã· ' + dep.yearDays + ' = ê°„ì£¼ìž„ëŒ€ë£Œ</td><td style="text-align:right;">â‚©' + dep.deemed.toLocaleString() + '</td></tr>';
            html += '</table>';

            html += '<h2 class="page-break">5. ì„¸ìž…ìžë³„ ëª…ì„¸</h2>';
            html += '<table><tr><th>ì„¸ìž…ìž</th><th>ì£¼ë¯¼ë²ˆí˜¸</th><th>í˜¸ì‹¤</th><th>ê³„ì•½ê¸°ê°„</th><th>ì›”ì„¸</th><th>ê´€ë¦¬ë¹„</th><th>ë³´ì¦ê¸ˆ</th><th>ì—°ê°„ìž„ëŒ€ìˆ˜ìž…</th></tr>';
            tenants.forEach(t => {
                const room = appData.rooms.find(r => r.id === t.roomId);
                const building = appData.buildings.find(b => b.id === t.buildingId);
                const roomLabel = (building ? building.name + ' ' : '') + (room ? room.roomNumber + 'í˜¸' : '');
                const yearRents = (appData.rents || []).filter(r => r.tenantId === t.id && r.status === 'paid' && r.month && r.month.startsWith(_taxYearPrefix()) && !_taxExcludedRents.has(r.id) && (!r.type || r.type === 'monthly'));
                const annualPaid = yearRents.reduce((s,r) => s + (r.amount||0), 0);
                html += '<tr><td>' + (t.name||'') + '</td><td>' + (t.residentId||'-') + '</td><td>' + roomLabel + '</td>'
                     + '<td>' + (t.contractStart||'') + '~' + (t.contractEnd||'') + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.monthlyRent||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.managementFee||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.deposit||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;font-weight:700;">â‚©' + annualPaid.toLocaleString() + '</td></tr>';
            });
            html += '</table>';

            html += '<h2>6. ìž„ëŒ€ìˆ˜ìž… ìƒì„¸ (ì›”ë³„)</h2>';
            html += '<table><tr><th>ì„¸ìž…ìž</th><th>ì›”</th><th>ìˆ˜ë‚©ì¼</th><th>ê¸ˆì•¡</th><th>ìƒíƒœ</th></tr>';
            inc.paidRents.filter(r => !_taxExcludedRents.has(r.id)).forEach(r => {
                const t = appData.tenants.find(t => t.id === r.tenantId) || {};
                html += '<tr><td>' + (t.name||'-') + '</td><td>' + r.month + '</td><td>' + (r.paidDate||'-') + '</td><td style="text-align:right;">â‚©' + (r.amount||0).toLocaleString() + '</td><td>' + (r.status || '') + '</td></tr>';
            });
            html += '<tr class="total-row"><td colspan="3">í•©ê³„</td><td style="text-align:right;">â‚©' + inc.totalIncluded.toLocaleString() + '</td><td></td></tr></table>';

            html += '<h2 class="page-break">7. í•„ìš”ê²½ë¹„ ìƒì„¸ (ì˜ìˆ˜ì¦ í¬í•¨)</h2>';
            html += '<table><tr><th>ë‚ ì§œ</th><th>ë¶„ë¥˜</th><th>í•­ëª©</th><th>ê±´ë¬¼/í˜¸ì‹¤</th><th>ê¸ˆì•¡</th></tr>';
            const dedExp = exp.yearExp.filter(e => !_taxExcludedExpenses.has(e.id) && _taxIsDeductible(e));
            dedExp.forEach(e => {
                const b = appData.buildings.find(x => x.id === e.buildingId);
                const r = appData.rooms.find(x => x.id === e.roomId);
                html += '<tr><td>' + (e.date||'') + '</td><td>' + (e.category||'') + '</td><td>' + (e.title||'') + '</td>'
                     + '<td>' + (b?.name||'') + ' ' + (r?.roomNumber||'') + '</td><td style="text-align:right;">â‚©' + (e.amount||0).toLocaleString() + '</td></tr>';
            });
            html += '<tr class="total-row"><td colspan="4">í•©ê³„</td><td style="text-align:right;">â‚©' + exp.deductibleTotal.toLocaleString() + '</td></tr></table>';

            // ì˜ìˆ˜ì¦ ì‚¬ì§„ ëª¨ìŒ
            const expWithReceipts = dedExp.filter(e => e.receipts && e.receipts.length > 0);
            if (expWithReceipts.length > 0) {
                html += '<h2 class="page-break">8. ì˜ìˆ˜ì¦ ì‚¬ì§„</h2>';
                expWithReceipts.forEach(e => {
                    html += '<h3>' + (e.date||'') + ' Â· ' + (e.title||'') + ' Â· â‚©' + (e.amount||0).toLocaleString() + '</h3>';
                    e.receipts.forEach(src => {
                        html += '<img src="' + src + '" class="receipt-img">';
                    });
                });
            }

            html += '<script>window.onload=function(){window.print();}<\/script></body></html>';
            const w = window.open('', '_blank');
            if (!w) { showToast('íŒì—…ì´ ì°¨ë‹¨ë˜ì—ˆìŠµë‹ˆë‹¤. ë¸Œë¼ìš°ì € ì„¤ì •ì„ í™•ì¸í•˜ì„¸ìš”.'); return; }
            w.document.write(html);
            w.document.close();
        }
        function _taxPrevYear() { _taxYear--; renderTaxFiling(); }
        function _taxNextYear() { _taxYear++; renderTaxFiling(); }
        function _taxSwitchTab(tab) {
            _taxActiveTab = tab;
            document.querySelectorAll('.tax-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            renderTaxFiling();
        }
        // ë¶„ë¥˜ í† ê¸€ (í•„ìš”ê²½ë¹„ â†” ë¹„í•„ìš”ê²½ë¹„)
        function _taxToggleCategory(expenseId) {
            const exp = appData.expenses.find(e => e.id === expenseId);
            if (!exp) return;
            const currentlyDeductible = _taxIsDeductible(exp);
            _taxExpenseOverride[expenseId] = currentlyDeductible ? 'non' : 'deductible';
            renderTaxFiling();
        }
        function _taxIsDeductible(exp) {
            if (_taxExpenseOverride[exp.id]) return _taxExpenseOverride[exp.id] === 'deductible';
            return _taxDeductibleCategories.has(exp.category || '');
        }
        function _taxToggleIncomeRent(rentId) {
            if (_taxExcludedRents.has(rentId)) _taxExcludedRents.delete(rentId);
            else _taxExcludedRents.add(rentId);
            renderTaxFiling();
        }
        function _taxToggleExpenseInclude(expenseId) {
            if (_taxExcludedExpenses.has(expenseId)) _taxExcludedExpenses.delete(expenseId);
            else _taxExcludedExpenses.add(expenseId);
            renderTaxFiling();
        }
        function _taxToggleAllRentsByTenant(tenantId, on) {
            const yp = _taxYear + '-';
            (appData.rents || []).forEach(r => {
                if (r.tenantId !== tenantId) return;
                if (!r.month || !r.month.startsWith(yp)) return;
                if (r.status !== 'paid') return;
                if (on) _taxExcludedRents.delete(r.id);
                else _taxExcludedRents.add(r.id);
            });
            renderTaxFiling();
        }
        function _taxUpdateRate(v) {
            const rate = parseFloat(v);
            if (!isNaN(rate) && rate >= 0 && rate <= 20) _taxDepositRate = rate;
            renderTaxFiling();
        }
        function _taxFmt(n) { return 'â‚©' + (n||0).toLocaleString(); }
        function _taxYearPrefix() { return _taxYear + '-'; }

        // ë°ì´í„° ì§‘ê³„
        function _taxCollectIncome() {
            const yp = _taxYearPrefix();
            const paidRents = (appData.rents || []).filter(r =>
                r.status === 'paid' && r.month && r.month.startsWith(yp) && (!r.type || r.type === 'monthly')
            );
            // ì„¸ìž…ìžë³„ ê·¸ë£¹
            const byTenant = {};
            paidRents.forEach(r => {
                if (!byTenant[r.tenantId]) byTenant[r.tenantId] = { tenant: null, rents: [], total: 0, included: 0 };
                byTenant[r.tenantId].tenant = appData.tenants.find(t => t.id === r.tenantId) || { id: r.tenantId, name: '(ì‚­ì œë¨)' };
                byTenant[r.tenantId].rents.push(r);
                byTenant[r.tenantId].total += (r.amount || 0);
                if (!_taxExcludedRents.has(r.id)) byTenant[r.tenantId].included += (r.amount || 0);
            });
            // rents ì›”ìˆœ ì •ë ¬
            Object.values(byTenant).forEach(g => g.rents.sort((a,b) => (a.month||'').localeCompare(b.month||'')));
            const totalGross = paidRents.reduce((s,r) => s + (r.amount||0), 0);
            const totalIncluded = paidRents.filter(r => !_taxExcludedRents.has(r.id)).reduce((s,r) => s + (r.amount||0), 0);
            return { paidRents, byTenant, totalGross, totalIncluded };
        }
        function _taxCollectExpenses() {
            const yp = _taxYearPrefix();
            const yearExp = (appData.expenses || []).filter(e => e.date && e.date.startsWith(yp));
            const byCategory = {};
            let deductibleTotal = 0, nonDeductibleTotal = 0, excludedTotal = 0;
            yearExp.forEach(e => {
                const cat = e.category || 'ë¯¸ë¶„ë¥˜';
                if (!byCategory[cat]) byCategory[cat] = { items: [], deductible: 0, non: 0 };
                byCategory[cat].items.push(e);
                if (_taxExcludedExpenses.has(e.id)) { excludedTotal += (e.amount||0); return; }
                if (_taxIsDeductible(e)) { deductibleTotal += (e.amount||0); byCategory[cat].deductible += (e.amount||0); }
                else { nonDeductibleTotal += (e.amount||0); byCategory[cat].non += (e.amount||0); }
            });
            return { yearExp, byCategory, deductibleTotal, nonDeductibleTotal, excludedTotal };
        }
        function _taxCollectDeposits() {
            // í•´ë‹¹ ì—°ë„ì— í™œì„±ì´ì—ˆë˜ ì„¸ìž…ìžë“¤ì˜ ë³´ì¦ê¸ˆ í•©ê³„
            const yp = _taxYearPrefix();
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            const active = (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart;
            });
            const depositSum = active.reduce((s,t) => s + (t.deposit || 0), 0);
            // ê°„ì£¼ìž„ëŒ€ë£Œ (ê°„ì†Œí™”: 3ì–µ ì´ˆê³¼ë¶„ë§Œ, ë³´ìœ ê¸°ê°„ 1ë…„ ê°€ì •, 60% ì ìš©)
            // ì •í™•í•œ ê³„ì‚°ì€ ë³´ì¦ê¸ˆì ìˆ˜Â·ê±´ì„¤ë¹„ ë“± ë³µìž¡í•˜ë¯€ë¡œ ê·¼ì‚¬ì¹˜ë§Œ ì œê³µ
            const THRESHOLD = 300000000; // 3ì–µ
            const excess = Math.max(0, depositSum - THRESHOLD);
            const deemed = Math.round(excess * 0.60 * (_taxDepositRate / 100));
            return { active, depositSum, excess, deemed };
        }

        // â”€â”€ ë Œë”ë§ â”€â”€
        function renderTaxFiling() {
            document.getElementById('taxYearLabel').textContent = _taxYear + 'ë…„';
            const content = document.getElementById('taxFilingContent');
            if (!content) return;
            if (_taxActiveTab === 'summary') content.innerHTML = _renderTaxSummary();
            else if (_taxActiveTab === 'income') content.innerHTML = _renderTaxIncome();
            else if (_taxActiveTab === 'expense') content.innerHTML = _renderTaxExpense();
            else if (_taxActiveTab === 'tenants') content.innerHTML = _renderTaxTenants();
        }
        function _renderTaxSummary() {
            const inc = _taxCollectIncome();
            const exp = _taxCollectExpenses();
            const dep = _taxCollectDeposits();
            const taxBase = inc.totalIncluded + dep.deemed - exp.deductibleTotal;
            const buildingsCount = appData.buildings.length;
            const tenantsCount = (appData.tenants||[]).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= _taxYear + '-12-31' && ce >= _taxYear + '-01-01';
            }).length;

            return ''
                + '<div class="tax-summary-grid">'
                + '  <div class="tax-card"><div class="tax-card-title">ìž„ëŒ€ ìˆ˜ìž… (í¬í•¨)</div><div class="tax-card-amt" style="color:#2563EB;">' + _taxFmt(inc.totalIncluded) + '</div></div>'
                + '  <div class="tax-card"><div class="tax-card-title">í•„ìš” ê²½ë¹„</div><div class="tax-card-amt" style="color:#DC2626;">' + _taxFmt(exp.deductibleTotal) + '</div></div>'
                + '  <div class="tax-card"><div class="tax-card-title">ê°„ì£¼ìž„ëŒ€ë£Œ (ê°œì‚°)</div><div class="tax-card-amt" style="color:#7C3AED;">' + _taxFmt(dep.deemed) + '</div></div>'
                + '  <div class="tax-card"><div class="tax-card-title">ëŒ€ìƒ ì„¸ìž…ìž</div><div class="tax-card-amt">' + tenantsCount + 'ëª…</div></div>'
                + '</div>'
                + '<div class="tax-final">'
                + '  <div class="tax-card-title">ðŸ“Š ìž„ëŒ€ì†Œë“ê¸ˆì•¡ (ìˆ˜ìž… + ê°„ì£¼ìž„ëŒ€ë£Œ âˆ’ í•„ìš”ê²½ë¹„)</div>'
                + '  <div class="tax-card-amt">' + _taxFmt(taxBase) + '</div>'
                + '  <div style="margin-top:6px;font-size:11px;color:rgba(255,255,255,0.85);">â€» ì¢…í•©ì†Œë“ì„¸ ì‹ ê³  ì‹œ ë‹¤ë¥¸ ì†Œë“ê³¼ í•©ì‚°ë˜ì–´ ëˆ„ì§„ì„¸ìœ¨ ì ìš©. ë³¸ í™”ë©´ì€ ìž„ëŒ€ ë¶€ë¶„ë§Œ ê³„ì‚°í•©ë‹ˆë‹¤.</div>'
                + '</div>'
                + '<div class="tax-card" style="margin-top:14px;">'
                + '  <div class="tax-card-title">ðŸ¦ ê°„ì£¼ìž„ëŒ€ë£Œ ì„¤ì •</div>'
                + '  <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;"><span>í•´ë‹¹ ì—°ë„ ë³´ì¦ê¸ˆ í•©ê³„</span><span class="tax-row-amt">' + _taxFmt(dep.depositSum) + '</span></div>'
                + '  <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;"><span>3ì–µì› ì´ˆê³¼ë¶„</span><span class="tax-row-amt">' + _taxFmt(dep.excess) + '</span></div>'
                + '  <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;gap:8px;"><span>ì •ê¸°ì˜ˆê¸ˆ ì´ìžìœ¨ (%)</span><input type="number" step="0.1" min="0" max="20" value="' + _taxDepositRate + '" onchange="_taxUpdateRate(this.value)" class="tax-deposit-input" style="width:90px;text-align:right;"></div>'
                + '  <div style="font-size:11px;color:#94A3B8;margin-top:6px;line-height:1.5;">â€» ê°„ì£¼ìž„ëŒ€ë£Œ = (ë³´ì¦ê¸ˆ âˆ’ 3ì–µ) Ã— 60% Ã— ì´ìžìœ¨. ë³¸ ê³„ì‚°ì€ ë‹¨ìˆœ ê·¼ì‚¬ì¹˜ì´ë©°, ì‹¤ì œ ì‹ ê³  ì‹œ ë³´ì¦ê¸ˆì ìˆ˜ ë“± ì •í™•í•œ ê³„ì‚°ì´ í•„ìš”í•©ë‹ˆë‹¤.</div>'
                + '</div>'
                + (buildingsCount === 0 ? '<div style="text-align:center;padding:20px;color:#94A3B8;font-size:13px;">ë“±ë¡ëœ ê±´ë¬¼ì´ ì—†ìŠµë‹ˆë‹¤.</div>' : '')
                + (inc.paidRents.length === 0 && exp.yearExp.length === 0 ? '<div style="text-align:center;padding:20px;color:#94A3B8;font-size:13px;">' + _taxYear + 'ë…„ ë°ì´í„°ê°€ ì—†ìŠµë‹ˆë‹¤.</div>' : '');
        }
        function _renderTaxIncome() {
            const inc = _taxCollectIncome();
            if (inc.paidRents.length === 0) return '<div style="text-align:center;padding:30px;color:#94A3B8;">' + _taxYear + 'ë…„ ë‚©ë¶€ ì™„ë£Œëœ ì›”ì„¸ ê¸°ë¡ì´ ì—†ìŠµë‹ˆë‹¤.</div>';
            let html = '<div style="font-size:12px;color:#64748B;margin-bottom:10px;line-height:1.5;">ì²´í¬ëœ í•­ëª©ë§Œ ì‹ ê³  ìžë£Œì— í¬í•¨ë©ë‹ˆë‹¤. ì„¸ìž…ìž ë‹¨ìœ„ë¡œ ì¼ê´„ í† ê¸€ ê°€ëŠ¥í•©ë‹ˆë‹¤.</div>';
            html += '<div style="display:flex;justify-content:space-between;padding:10px 14px;background:#0F766E;color:white;border-radius:8px;margin-bottom:8px;font-weight:800;font-size:14px;"><span>ì´ ìž„ëŒ€ìˆ˜ìž… (í¬í•¨)</span><span>' + _taxFmt(inc.totalIncluded) + ' / ' + _taxFmt(inc.totalGross) + '</span></div>';
            // ì„¸ìž…ìžë³„ ê·¸ë£¹
            Object.values(inc.byTenant).forEach(g => {
                const tenant = g.tenant;
                const room = appData.rooms.find(r => r.id === tenant.roomId);
                const building = appData.buildings.find(b => b.id === tenant.buildingId);
                const roomLabel = (building ? building.name + ' Â· ' : '') + (room ? room.roomNumber + 'í˜¸' : '');
                const allOn = g.rents.every(r => !_taxExcludedRents.has(r.id));
                html += '<div class="tax-group-header">'
                     + '<span>' + escapeHTML(tenant.name) + ' <span style="font-weight:500;color:#64748B;font-size:11px;">(' + escapeHTML(roomLabel) + ')</span></span>'
                     + '<span style="display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#475569;">' + _taxFmt(g.included) + '/' + _taxFmt(g.total) + '</span>'
                     + '<button onclick="_taxToggleAllRentsByTenant(\'' + tenant.id + '\',' + (!allOn) + ')" style="font-size:11px;padding:3px 8px;background:white;border:1px solid #CBD5E1;border-radius:6px;cursor:pointer;">' + (allOn ? 'ì „ì²´í•´ì œ' : 'ì „ì²´ì„ íƒ') + '</button></span></div>';
                g.rents.forEach(r => {
                    const checked = !_taxExcludedRents.has(r.id);
                    html += '<div class="tax-row">'
                         + '<label><input type="checkbox" ' + (checked?'checked':'') + ' onchange="_taxToggleIncomeRent(\'' + r.id + '\')">'
                         + '<span>' + r.month + (r.paidDate ? ' Â· ' + r.paidDate : '') + (r.memo ? ' Â· ' + escapeHTML(r.memo.slice(0,30)) : '') + '</span></label>'
                         + '<span class="tax-row-amt' + (checked?'':' excluded') + '">' + _taxFmt(r.amount) + '</span></div>';
                });
            });
            return html;
        }
        function _renderTaxExpense() {
            const exp = _taxCollectExpenses();
            if (exp.yearExp.length === 0) return '<div style="text-align:center;padding:30px;color:#94A3B8;">' + _taxYear + 'ë…„ ì§€ì¶œ ê¸°ë¡ì´ ì—†ìŠµë‹ˆë‹¤.</div>';
            let html = '<div style="font-size:12px;color:#64748B;margin-bottom:10px;line-height:1.5;">ì¹´í…Œê³ ë¦¬ ë°°ì§€ë¥¼ ëˆŒëŸ¬ í•„ìš”ê²½ë¹„/ë¹„í•„ìš”ê²½ë¹„ë¥¼ ë³€ê²½í•  ìˆ˜ ìžˆìŠµë‹ˆë‹¤.</div>';
            html += '<div style="display:flex;justify-content:space-between;padding:10px 14px;background:#0F766E;color:white;border-radius:8px;margin-bottom:8px;font-weight:800;font-size:14px;"><span>í•„ìš”ê²½ë¹„ í•©ê³„</span><span>' + _taxFmt(exp.deductibleTotal) + '</span></div>';
            // ì¹´í…Œê³ ë¦¬ë³„ ê·¸ë£¹
            Object.keys(exp.byCategory).sort().forEach(cat => {
                const g = exp.byCategory[cat];
                html += '<div class="tax-group-header"><span>' + escapeHTML(cat) + '</span><span style="font-size:12px;color:#475569;">í•„ìš” ' + _taxFmt(g.deductible) + (g.non>0?' Â· ë¹„í•„ìš” ' + _taxFmt(g.non):'') + '</span></div>';
                g.items.forEach(e => {
                    const isDed = _taxIsDeductible(e);
                    const included = !_taxExcludedExpenses.has(e.id);
                    const pillClass = isDed ? '' : 'non';
                    const pillText = isDed ? 'í•„ìš”ê²½ë¹„' : 'ë¹„í•„ìš”';
                    html += '<div class="tax-row">'
                         + '<label><input type="checkbox" ' + (included?'checked':'') + ' onchange="_taxToggleExpenseInclude(\'' + e.id + '\')">'
                         + '<span>' + escapeHTML(e.title || '(ì œëª©ì—†ìŒ)') + ' Â· ' + (e.date||'-') + '</span>'
                         + '<span class="tax-cat-pill ' + pillClass + '" onclick="event.preventDefault();_taxToggleCategory(\'' + e.id + '\')">' + pillText + '</span></label>'
                         + '<span class="tax-row-amt' + (included?'':' excluded') + '">' + _taxFmt(e.amount) + '</span></div>';
                });
            });
            return html;
        }
        function _renderTaxTenants() {
            const yp = _taxYearPrefix();
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            const tenants = (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart;
            });
            if (tenants.length === 0) return '<div style="text-align:center;padding:30px;color:#94A3B8;">' + _taxYear + 'ë…„ ìž„ëŒ€ ì¤‘ì´ì—ˆë˜ ì„¸ìž…ìžê°€ ì—†ìŠµë‹ˆë‹¤.</div>';
            let html = '<div style="font-size:12px;color:#64748B;margin-bottom:10px;line-height:1.5;">êµ­ì„¸ì²­ ì‹ ê³  ì‹œ ì„¸ìž…ìž ëª…ì„¸ ì–‘ì‹ì˜ ê¸°ë³¸ ë°ì´í„°ìž…ë‹ˆë‹¤.</div>';
            tenants.forEach(t => {
                const room = appData.rooms.find(r => r.id === t.roomId);
                const building = appData.buildings.find(b => b.id === t.buildingId);
                const roomLabel = (building ? building.name + ' ' : '') + (room ? room.roomNumber + 'í˜¸' : '');
                const yearRents = (appData.rents || []).filter(r => r.tenantId === t.id && r.status === 'paid' && r.month && r.month.startsWith(yp) && (!r.type || r.type === 'monthly'));
                const annualPaid = yearRents.reduce((s,r) => s + (r.amount||0), 0);
                const rid = t.residentId ? t.residentId.slice(0,8) + '******' : '-';
                html += '<div class="tax-card" style="background:white;border:1px solid #E2E8F0;">'
                     + '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px;"><div style="font-weight:800;font-size:15px;">' + escapeHTML(t.name) + '</div><div style="font-size:11px;color:#94A3B8;">' + escapeHTML(roomLabel) + '</div></div>'
                     + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:12px;color:#475569;">'
                     + '<div>ì£¼ë¯¼ë²ˆí˜¸: ' + rid + '</div>'
                     + '<div>ì „í™”: ' + escapeHTML(t.phone || '-') + '</div>'
                     + '<div>ê³„ì•½: ' + escapeHTML(t.contractStart || '-') + ' ~ ' + escapeHTML(t.contractEnd || '-') + '</div>'
                     + '<div>ì›”ì„¸: â‚©' + (t.monthlyRent||0).toLocaleString() + (t.managementFee>0 ? ' + ê´€ë¦¬ë¹„ â‚©' + t.managementFee.toLocaleString() : '') + '</div>'
                     + '<div>ë³´ì¦ê¸ˆ: â‚©' + (t.deposit||0).toLocaleString() + '</div>'
                     + '<div style="font-weight:800;color:#0F766E;">ì—°ê°„ ìž„ëŒ€ìˆ˜ìž…: â‚©' + annualPaid.toLocaleString() + '</div>'
                     + '</div></div>';
            });
            return html;
        }

        // â”€â”€ ë‚´ë³´ë‚´ê¸° â”€â”€
        function exportTaxFilingCSV() {
            const inc = _taxCollectIncome();
            const exp = _taxCollectExpenses();
            const dep = _taxCollectDeposits();
            const taxBase = inc.totalIncluded + dep.deemed - exp.deductibleTotal;
            let csv = 'ï»¿'; // UTF-8 BOM
            csv += '## ' + _taxYear + 'ë…„ ì¢…í•©ì†Œë“ì„¸ ìž„ëŒ€ì†Œë“ ì‹ ê³  ìžë£Œ\n';
            csv += 'ìƒì„±ì¼,' + new Date().toISOString().split('T')[0] + '\n\n';
            csv += '## ìš”ì•½\n';
            csv += 'í•­ëª©,ê¸ˆì•¡\n';
            csv += 'ìž„ëŒ€ìˆ˜ìž… í•©ê³„,' + inc.totalIncluded + '\n';
            csv += 'ê°„ì£¼ìž„ëŒ€ë£Œ (ê°œì‚°),' + dep.deemed + '\n';
            csv += 'í•„ìš”ê²½ë¹„ í•©ê³„,' + exp.deductibleTotal + '\n';
            csv += 'ìž„ëŒ€ì†Œë“ê¸ˆì•¡,' + taxBase + '\n\n';
            csv += '## ì„¸ìž…ìžë³„ ëª…ì„¸\n';
            csv += 'ì„¸ìž…ìžëª…,ì£¼ë¯¼ë²ˆí˜¸,í˜¸ì‹¤,ê³„ì•½ì‹œìž‘,ê³„ì•½ì¢…ë£Œ,ì›”ì„¸,ê´€ë¦¬ë¹„,ë³´ì¦ê¸ˆ,ì—°ê°„ìž„ëŒ€ìˆ˜ìž…\n';
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart;
            }).forEach(t => {
                const room = appData.rooms.find(r => r.id === t.roomId);
                const building = appData.buildings.find(b => b.id === t.buildingId);
                const roomLabel = (building ? building.name + ' ' : '') + (room ? room.roomNumber + 'í˜¸' : '');
                const yearRents = (appData.rents || []).filter(r => r.tenantId === t.id && r.status === 'paid' && r.month && r.month.startsWith(_taxYearPrefix()) && !_taxExcludedRents.has(r.id) && (!r.type || r.type === 'monthly'));
                const annualPaid = yearRents.reduce((s,r) => s + (r.amount||0), 0);
                csv += '"' + (t.name||'') + '","' + (t.residentId||'') + '","' + roomLabel + '","' + (t.contractStart||'') + '","' + (t.contractEnd||'') + '",' + (t.monthlyRent||0) + ',' + (t.managementFee||0) + ',' + (t.deposit||0) + ',' + annualPaid + '\n';
            });
            csv += '\n## ìž„ëŒ€ìˆ˜ìž… ìƒì„¸ (í¬í•¨ëœ í•­ëª©)\n';
            csv += 'ì„¸ìž…ìž,ì›”,ìˆ˜ë‚©ì¼,ê¸ˆì•¡,ë©”ëª¨\n';
            inc.paidRents.filter(r => !_taxExcludedRents.has(r.id)).forEach(r => {
                const t = appData.tenants.find(t => t.id === r.tenantId) || {};
                csv += '"' + (t.name||'-') + '","' + r.month + '","' + (r.paidDate||'') + '",' + (r.amount||0) + ',"' + (r.memo||'').replace(/"/g,'""') + '"\n';
            });
            csv += '\n## í•„ìš”ê²½ë¹„ ìƒì„¸\n';
            csv += 'ë‚ ì§œ,ë¶„ë¥˜,í•­ëª©,ê¸ˆì•¡,ê±´ë¬¼,í˜¸ì‹¤,í•„ìš”ê²½ë¹„ì—¬ë¶€\n';
            exp.yearExp.filter(e => !_taxExcludedExpenses.has(e.id)).forEach(e => {
                const b = appData.buildings.find(x => x.id === e.buildingId);
                const r = appData.rooms.find(x => x.id === e.roomId);
                csv += '"' + (e.date||'') + '","' + (e.category||'') + '","' + (e.title||'').replace(/"/g,'""') + '",' + (e.amount||0) + ',"' + (b?.name||'') + '","' + (r?.roomNumber||'') + '","' + (_taxIsDeductible(e) ? 'í•„ìš”ê²½ë¹„' : 'ë¹„í•„ìš”') + '"\n';
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ì¢…í•©ì†Œë“ì„¸_ìž„ëŒ€ì†Œë“_' + _taxYear + 'ë…„_' + new Date().toISOString().split('T')[0] + '.csv';
            a.click();
            URL.revokeObjectURL(url);
            showToast('âœ… CSV íŒŒì¼ì´ ë‹¤ìš´ë¡œë“œë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        function printTaxFiling() {
            const inc = _taxCollectIncome();
            const exp = _taxCollectExpenses();
            const dep = _taxCollectDeposits();
            const taxBase = inc.totalIncluded + dep.deemed - exp.deductibleTotal;
            const yearStart = _taxYear + '-01-01';
            const yearEnd = _taxYear + '-12-31';
            const tenants = (appData.tenants || []).filter(t => {
                const cs = t.contractStart || '';
                const ce = t.contractEnd || '9999-12-31';
                return cs && cs <= yearEnd && ce >= yearStart;
            });
            let html = '<html><head><meta charset="utf-8"><title>' + _taxYear + 'ë…„ ì¢…í•©ì†Œë“ì„¸ ìž„ëŒ€ì†Œë“ ì‹ ê³  ìžë£Œ</title>'
                + '<style>body{font-family:"Malgun Gothic",sans-serif;margin:0;padding:24px;color:#1E293B;}'
                + 'h1{font-size:20px;margin:0 0 4px;}h2{font-size:15px;margin:18px 0 8px;border-bottom:2px solid #0F766E;padding-bottom:4px;color:#0F766E;}'
                + 'table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px;}'
                + 'th,td{border:1px solid #CBD5E1;padding:6px 8px;text-align:left;}'
                + 'th{background:#F1F5F9;font-weight:700;}'
                + '.total-row{background:#F0FDFA;font-weight:700;}'
                + '.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0;}'
                + '.summary-card{border:1px solid #CBD5E1;border-radius:6px;padding:10px;}'
                + '.summary-label{font-size:10px;color:#64748B;margin-bottom:4px;}'
                + '.summary-amt{font-size:14px;font-weight:800;}'
                + '.final{background:#0F766E;color:white;padding:12px;border-radius:8px;text-align:center;margin:12px 0;}'
                + '.final .summary-amt{font-size:20px;color:white;}'
                + '.final .summary-label{color:rgba(255,255,255,0.85);}'
                + '@media print{body{padding:12px;}}</style></head><body>';
            html += '<h1>' + _taxYear + 'ë…„ ì¢…í•©ì†Œë“ì„¸ ìž„ëŒ€ì†Œë“ ì‹ ê³  ìžë£Œ</h1>';
            html += '<div style="font-size:11px;color:#64748B;">ìƒì„±ì¼: ' + new Date().toISOString().split('T')[0] + '</div>';

            html += '<h2>ðŸ“Š ìš”ì•½</h2>';
            html += '<div class="summary-grid">'
                  + '<div class="summary-card"><div class="summary-label">ìž„ëŒ€ìˆ˜ìž…</div><div class="summary-amt">â‚©' + inc.totalIncluded.toLocaleString() + '</div></div>'
                  + '<div class="summary-card"><div class="summary-label">ê°„ì£¼ìž„ëŒ€ë£Œ</div><div class="summary-amt">â‚©' + dep.deemed.toLocaleString() + '</div></div>'
                  + '<div class="summary-card"><div class="summary-label">í•„ìš”ê²½ë¹„</div><div class="summary-amt">â‚©' + exp.deductibleTotal.toLocaleString() + '</div></div>'
                  + '<div class="summary-card"><div class="summary-label">ëŒ€ìƒ ì„¸ìž…ìž</div><div class="summary-amt">' + tenants.length + 'ëª…</div></div>'
                  + '</div>';
            html += '<div class="final"><div class="summary-label">ðŸ“Š ìž„ëŒ€ì†Œë“ê¸ˆì•¡ (ìˆ˜ìž… + ê°„ì£¼ìž„ëŒ€ë£Œ âˆ’ í•„ìš”ê²½ë¹„)</div><div class="summary-amt">â‚©' + taxBase.toLocaleString() + '</div></div>';

            html += '<h2>ðŸ‘¥ ì„¸ìž…ìžë³„ ëª…ì„¸</h2>';
            html += '<table><thead><tr><th>ì„¸ìž…ìž</th><th>ì£¼ë¯¼ë²ˆí˜¸</th><th>í˜¸ì‹¤</th><th>ê³„ì•½ê¸°ê°„</th><th>ì›”ì„¸</th><th>ê´€ë¦¬ë¹„</th><th>ë³´ì¦ê¸ˆ</th><th>ì—°ê°„ìž„ëŒ€ìˆ˜ìž…</th></tr></thead><tbody>';
            tenants.forEach(t => {
                const room = appData.rooms.find(r => r.id === t.roomId);
                const building = appData.buildings.find(b => b.id === t.buildingId);
                const roomLabel = (building ? building.name + ' ' : '') + (room ? room.roomNumber + 'í˜¸' : '');
                const yearRents = (appData.rents || []).filter(r => r.tenantId === t.id && r.status === 'paid' && r.month && r.month.startsWith(_taxYearPrefix()) && !_taxExcludedRents.has(r.id) && (!r.type || r.type === 'monthly'));
                const annualPaid = yearRents.reduce((s,r) => s + (r.amount||0), 0);
                html += '<tr><td>' + (t.name||'') + '</td><td>' + (t.residentId||'-') + '</td><td>' + roomLabel + '</td>'
                     + '<td>' + (t.contractStart||'') + '~' + (t.contractEnd||'') + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.monthlyRent||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.managementFee||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;">â‚©' + (t.deposit||0).toLocaleString() + '</td>'
                     + '<td style="text-align:right;font-weight:700;">â‚©' + annualPaid.toLocaleString() + '</td></tr>';
            });
            html += '</tbody></table>';

            html += '<h2>ðŸ’° ìž„ëŒ€ìˆ˜ìž… ìƒì„¸</h2>';
            html += '<table><thead><tr><th>ì„¸ìž…ìž</th><th>ì›”</th><th>ìˆ˜ë‚©ì¼</th><th>ê¸ˆì•¡</th></tr></thead><tbody>';
            inc.paidRents.filter(r => !_taxExcludedRents.has(r.id)).forEach(r => {
                const t = appData.tenants.find(t => t.id === r.tenantId) || {};
                html += '<tr><td>' + (t.name||'-') + '</td><td>' + r.month + '</td><td>' + (r.paidDate||'-') + '</td><td style="text-align:right;">â‚©' + (r.amount||0).toLocaleString() + '</td></tr>';
            });
            html += '<tr class="total-row"><td colspan="3">í•©ê³„</td><td style="text-align:right;">â‚©' + inc.totalIncluded.toLocaleString() + '</td></tr></tbody></table>';

            html += '<h2>ðŸ“‹ í•„ìš”ê²½ë¹„ ìƒì„¸</h2>';
            html += '<table><thead><tr><th>ë‚ ì§œ</th><th>ë¶„ë¥˜</th><th>í•­ëª©</th><th>ê±´ë¬¼/í˜¸ì‹¤</th><th>ê¸ˆì•¡</th></tr></thead><tbody>';
            exp.yearExp.filter(e => !_taxExcludedExpenses.has(e.id) && _taxIsDeductible(e)).forEach(e => {
                const b = appData.buildings.find(x => x.id === e.buildingId);
                const r = appData.rooms.find(x => x.id === e.roomId);
                html += '<tr><td>' + (e.date||'') + '</td><td>' + (e.category||'') + '</td><td>' + (e.title||'') + '</td>'
                     + '<td>' + (b?.name||'') + ' ' + (r?.roomNumber||'') + '</td><td style="text-align:right;">â‚©' + (e.amount||0).toLocaleString() + '</td></tr>';
            });
            html += '<tr class="total-row"><td colspan="4">í•©ê³„</td><td style="text-align:right;">â‚©' + exp.deductibleTotal.toLocaleString() + '</td></tr></tbody></table>';

            html += '<script>window.onload=function(){window.print();}<\/script></body></html>';
            const w = window.open('', '_blank');
            if (!w) { showToast('íŒì—…ì´ ì°¨ë‹¨ë˜ì—ˆìŠµë‹ˆë‹¤. ë¸Œë¼ìš°ì € ì„¤ì •ì„ í™•ì¸í•˜ì„¸ìš”.'); return; }
            w.document.write(html);
            w.document.close();
        }

        function exportToCSV() {
            let csv = 'ê±´ë¬¼ëª…,ì£¼ì†Œ,ì„¸ëŒ€ìˆ˜\n';
            appData.buildings.forEach(b => {
                csv += `${b.name},${b.address},${b.totalRooms}\n`;
            });
            csv += '\nì„¸ìž…ìž,ê±´ë¬¼,ë°©,ì›”ì„¸,ë³´ì¦ê¸ˆ,ê³„ì•½ì‹œìž‘,ê³„ì•½ì¢…ë£Œ\n';
            appData.tenants.forEach(t => {
                const building = appData.buildings.find(b => b.id === t.buildingId);
                const room = appData.rooms.find(r => r.id === t.roomId);
                csv += `${t.name},${building?.name ?? ''},${room?.roomNumber ?? ''},${t.monthlyRent ?? ''},${t.deposit ?? ''},${t.contractStart ?? ''},${t.contractEnd ?? ''}\n`;
            });
            csv += '\nì›”ì„¸ìˆ˜ë‚©,ì„¸ìž…ìž,ê±´ë¬¼,ê¸ˆì•¡,ì›”,ìƒíƒœ\n';
            appData.rents.forEach(r => {
                const tenant = appData.tenants.find(t => t.id === r.tenantId);
                const building = appData.buildings.find(b => b.id === r.buildingId);
                csv += `${tenant?.name},${building?.name},${r.amount},${r.month},${r.status}\n`;
            });
            csv += '\nì§€ì¶œ,ê±´ë¬¼,ì¹´í…Œê³ ë¦¬,ì œëª©,ê¸ˆì•¡,ë‚ ì§œ\n';
            appData.expenses.forEach(e => {
                const building = appData.buildings.find(b => b.id === e.buildingId);
                csv += `${building?.name},${e.category},${e.title},${e.amount},${e.date}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ìž„ëŒ€ê´€ë¦¬ì•±_' + new Date().toISOString().split('T')[0] + '.csv';
            link.click();
            // â„¹ï¸ ì•ˆë‚´: CSVì—ëŠ” í…ìŠ¤íŠ¸ ë°ì´í„°(ê±´ë¬¼Â·ì„¸ìž…ìžÂ·ìˆ˜ë‚©Â·ì§€ì¶œ)ë§Œ í¬í•¨ë©ë‹ˆë‹¤.
            //          ì˜ìˆ˜ì¦ ì‚¬ì§„ì€ CSVì— í¬í•¨ë˜ì§€ ì•ŠìŠµë‹ˆë‹¤ (JSON ë‚´ë³´ë‚´ê¸°ì—ë„ í¬í•¨ ì•ˆ ë¨).
            //          ì‚¬ì§„ì€ ê° ê¸°ê¸° ë¸Œë¼ìš°ì € localStorageì—ë§Œ ë³´ê´€ë©ë‹ˆë‹¤.
            showToast('âœ… CSV ë‹¤ìš´ë¡œë“œ ì™„ë£Œ (ì˜ìˆ˜ì¦ ì‚¬ì§„ì€ ë¯¸í¬í•¨)');
        }
        // ============ FIREBASE REALTIME SYNC ============
        let _db = null;
        let _fbUnsubscribe = null;
        let _fbDebounceTimer = null;
        let _fbStatusHideTimer = null;
        var _fbLastFamilyToastAt = 0;

        function _fbConfigured() {
            // FIREBASE_CONFIG ê°’ì´ ì‹¤ì œë¡œ ì±„ì›Œì ¸ ìžˆëŠ”ì§€ í™•ì¸
            return FIREBASE_CONFIG.projectId && !FIREBASE_CONFIG.projectId.includes('ì—¬ê¸°ì—');
        }

        /** Firestore ê·œì¹™(request.auth)ê³¼ ë§žì¶”ê¸°: ìµëª… ë¡œê·¸ì¸(ì½˜ì†”ì—ì„œ ì¼œì•¼ í•¨) */
        function _ensureFirebaseAuth() {
            return new Promise(function(resolve, reject) {
                try {
                    var auth = firebase.auth();
                    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function() {});
                    if (auth.currentUser) {
                        resolve(auth.currentUser);
                        return;
                    }
                    auth.signInAnonymously().then(function(cred) { resolve(cred.user); }).catch(reject);
                } catch (e) {
                    reject(e);
                }
            });
        }

        function initFirebase() {
            if (!_fbConfigured()) return; // config ë¯¸ìž…ë ¥ ì‹œ ì¡°ìš©ížˆ ì¢…ë£Œ
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(FIREBASE_CONFIG);
                }
                _ensureFirebaseAuth()
                    .then(function() {
                        _db = firebase.firestore();
                        return _db.enablePersistence({ synchronizeTabs: true });
                    })
                    .then(function() { _startFirestoreListener(); })
                    .catch(function(err) {
                        if (err && err.code === 'failed-precondition') {
                            console.warn('Firestore persistence: ë‹¤ë¥¸ íƒ­ì—ì„œ ì´ë¯¸ ì¼œì ¸ ìžˆì„ ìˆ˜ ìžˆì–´ìš”.');
                        } else if (err && err.code === 'unimplemented') {
                            console.warn('Firestore persistence: ì´ ë¸Œë¼ìš°ì €ì—ì„œëŠ” ìºì‹œ ë™ê¸°ê°€ ì œí•œë©ë‹ˆë‹¤.');
                        }
                        if (_db) {
                            _startFirestoreListener();
                        } else {
                            console.error('Firebase auth/init:', err);
                            showToast('âš ï¸ Firebase ë¡œê·¸ì¸ ì‹¤íŒ¨. Firebase ì½˜ì†” â†’ Authentication â†’ ìµëª… ì„ ì‚¬ìš©í•¨ìœ¼ë¡œ ì¼œ ì£¼ì„¸ìš”.', 5000);
                            _showFbStatus('error');
                        }
                    });
            } catch(e) {
                console.error('Firebase init error:', e);
                _showFbStatus('error');
            }
        }

        /** ì˜ìˆ˜ì¦ ì œì™¸Â·idìˆœ ì •ë ¬ë¡œ ë™ê¸°í™” ì•Œë¦¼ìš© ë¹„êµ ë¬¸ìžì—´ */
        function _appDataForSyncCompare(data) {
            try {
                var keys = ['buildings', 'rooms', 'tenants', 'rents', 'expenses'];
                var o = {};
                keys.forEach(function(k) {
                    var arr = (data && data[k]) || [];
                    if (!Array.isArray(arr)) arr = [];
                    var sorted = arr.slice().sort(function(a, b) {
                        return String((a && a.id) || '').localeCompare(String((b && b.id) || ''));
                    });
                    if (k === 'expenses') {
                        sorted = sorted.map(function(e) {
                            if (!e || typeof e !== 'object') return e;
                            var x = Object.assign({}, e);
                            delete x.receipts;
                            return x;
                        });
                    }
                    o[k] = sorted;
                });
                return JSON.stringify(o);
            } catch (e) {
                return '';
            }
        }

        function cloudSaveNow() {
            if (!_db) {
                showToast('â˜ï¸ Firebaseê°€ ì•„ì§ ì—°ê²°ë˜ì§€ ì•Šì•˜ì–´ìš”. ì„¤ì •ì—ì„œ ìƒíƒœë¥¼ í™•ì¸í•´ ì£¼ì„¸ìš”.');
                return;
            }
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                showToast('ðŸ“µ ì¸í„°ë„·ì— ì—°ê²°ëœ ë’¤ ë‹¤ì‹œ ëˆŒëŸ¬ ì£¼ì„¸ìš”.');
                return;
            }
            _showFbStatus('syncing');
            _flushFirestorePending().then(function() {
                showToast('âœ… í´ë¼ìš°ë“œì— ë°˜ì˜í–ˆì–´ìš”. ìž ì‹œ í›„ ë‹¤ë¥¸ í°ì—ë„ ê°ˆ ê±°ì˜ˆìš”.', 2800);
            }).catch(function() {
                showToast('âš ï¸ ì €ìž¥ì´ ìž˜ ì•ˆ ëì–´ìš”. ìž ì‹œ í›„ ë‹¤ì‹œ ëˆŒëŸ¬ ì£¼ì„¸ìš”.', 3200);
            });
        }

        /** ë³‘í•©Â·ì¶©ëŒ ì‹œ ì •ë ¬ìš© ì‹œê°(ms). updatedAt â†’ createdAt â†’ paidDate/date */
        function _itemVersionMs(item) {
            if (!item) return 0;
            var ms = Date.parse(item.updatedAt || '');
            if (!isNaN(ms)) return ms;
            ms = Date.parse(item.createdAt || '');
            if (!isNaN(ms)) return ms;
            if (item.paidDate) {
                ms = Date.parse(item.paidDate);
                if (!isNaN(ms)) return ms;
            }
            if (item.date) {
                ms = Date.parse((item.date + '').slice(0, 10));
                if (!isNaN(ms)) return ms;
            }
            return 0;
        }
        function _pickNewerMergeItem(localItem, remoteItem, tiePreferLocal) {
            var tL = _itemVersionMs(localItem);
            var tR = _itemVersionMs(remoteItem);
            if (tL > tR) return localItem;
            if (tR > tL) return remoteItem;
            return tiePreferLocal ? localItem : remoteItem;
        }
        /** ê°™ì€ idê°€ ì–‘ìª½ì— ìžˆìœ¼ë©´ ë” ìµœê·¼(updatedAt ë“±) ìª½ì„ ì±„íƒ */
        function _mergeArraysWithVersions(localArr, remoteArr, tiePreferLocal) {
            var map = {};
            (remoteArr || []).forEach(function(item) {
                if (item && item.id) map[item.id] = { r: item, l: null };
            });
            (localArr || []).forEach(function(item) {
                if (!item || !item.id) return;
                if (!map[item.id]) map[item.id] = { r: null, l: item };
                else map[item.id].l = item;
            });
            return Object.keys(map).map(function(id) {
                var cell = map[id];
                if (!cell.r) return cell.l;
                if (!cell.l) return cell.r;
                return _pickNewerMergeItem(cell.l, cell.r, tiePreferLocal);
            });
        }
        // ë‘ ë°°ì—´ì„ ID ê¸°ì¤€ìœ¼ë¡œ ë³‘í•© (localì´ remoteë¥¼ ë®ì–´ì”€ â†’ ê° ê¸°ê¸° ë¡œì»¬ ë°ì´í„° ìš°ì„ )
        function _mergeArrays(localArr, remoteArr) {
            var merged = {};
            // 1) ì›ê²© í•­ëª© ë¨¼ì € ì‚½ìž…
            (remoteArr || []).forEach(function(item) {
                if (item && item.id) merged[item.id] = item;
            });
            // 2) ë¡œì»¬ í•­ëª©ìœ¼ë¡œ ë®ì–´ì”€ (ë¡œì»¬ ìš°ì„  â€” ì—„ë§ˆ í•¸ë“œí° ë°ì´í„° ë³´ì¡´)
            (localArr || []).forEach(function(item) {
                if (item && item.id) merged[item.id] = item;
            });
            return Object.values(merged);
        }

        // ë¡œì»¬ì—ë§Œ ìžˆëŠ” IDê°€ ìžˆëŠ”ì§€ í™•ì¸ (ì—…ë¡œë“œ í•„ìš” ì—¬ë¶€)
        function _hasLocalOnlyItems(localArr, remoteArr) {
            var remoteIds = new Set((remoteArr || []).map(function(i) { return i && i.id; }));
            return (localArr || []).some(function(i) { return i && i.id && !remoteIds.has(i.id); });
        }
        function _hasLocalNewerThanRemote(localArr, remoteArr) {
            var remoteMap = {};
            (remoteArr || []).forEach(function(i) {
                if (i && i.id) remoteMap[i.id] = i;
            });
            return (localArr || []).some(function(l) {
                if (!l || !l.id) return false;
                var r = remoteMap[l.id];
                if (!r) return false;
                return _itemVersionMs(l) > _itemVersionMs(r);
            });
        }

        function _startFirestoreListener() {
            if (_fbUnsubscribe) _fbUnsubscribe();
            // 1ì´ˆ í›„ì—ë„ ì—°ê²° ì¤‘ì´ë©´ ë°°ì§€ í‘œì‹œ, 5ì´ˆ í›„ ìžë™ ìˆ¨ê¹€
            var _connectingTimer = setTimeout(function() {
                _showFbStatus('connecting');
                setTimeout(function() {
                    var el = document.getElementById('fbSyncPill');
                    if (el && el.textContent.indexOf('ì—°ê²° ì¤‘') !== -1) el.style.display = 'none';
                }, 5000);
            }, 1000);
            _fbUnsubscribe = _db.collection('rentalApp').doc('main').onSnapshot(function(doc) {
                clearTimeout(_connectingTimer);
                // hasPendingWrites=true â†’ ë°©ê¸ˆ ìš°ë¦¬ê°€ ì“´ ê²ƒ, í™”ë©´ ì—…ë°ì´íŠ¸ ë¶ˆí•„ìš”
                if (doc.metadata.hasPendingWrites) return;

                if (!doc.exists) {
                    // â”€â”€ Firestoreê°€ ë¹„ì–´ìžˆìŒ â†’ ë¡œì»¬ ë°ì´í„° ì—…ë¡œë“œ (ìµœì´ˆ ì—°ê²°) â”€â”€
                    var hasLocal = (appData.buildings||[]).length > 0
                                || (appData.tenants||[]).length > 0
                                || (appData.rooms||[]).length > 0;
                    if (hasLocal) {
                        _saveToFirestore(0);
                        localStorage.setItem('_fbSyncInit','1');
                        showToast('â˜ï¸ ê¸°ì¡´ ë°ì´í„°ë¥¼ í´ë¼ìš°ë“œì— ì—…ë¡œë“œí–ˆìŠµë‹ˆë‹¤');
                    }
                    _showFbStatus('connected');
                    _updateFirebaseSettingsUI();
                    return;
                }

                // â”€â”€ Firestoreì— ë°ì´í„° ìžˆìŒ â†’ ë³‘í•© â”€â”€
                _mergeRemoteData(doc.data(), { fromCache: doc.metadata.fromCache });
                _showFbStatus('synced');
                _updateFirebaseSettingsUI();
            }, function(err) {
                console.error('Firestore listener error:', err);
                _showFbStatus('error');
                _updateFirebaseSettingsUI();
            });
        }

        function _mergeRemoteData(remote, meta) {
            meta = meta || {};
            var prevSnap = _appDataForSyncCompare(appData);
            var localData;
            try {
                localData = JSON.parse(localStorage.getItem('appData') || '{}');
                var req = ['buildings', 'rooms', 'tenants', 'rents', 'expenses'];
                if (!req.every(function(k) { return Array.isArray(localData[k]); }))
                    localData = JSON.parse(JSON.stringify(appData));
            } catch (e) {
                localData = JSON.parse(JSON.stringify(appData));
            }
            var keys = ['buildings', 'rooms', 'tenants', 'rents', 'expenses'];
            // ì´ë¯¸ í•œ ë²ˆ ì´ìƒ ë™ê¸°í™”ê°€ ì™„ë£Œëœ ê¸°ê¸°ì¸ì§€ í™•ì¸
            var synced = !!localStorage.getItem('_fbSyncInit');
            var merged = {};
            var needUpload = false;

            keys.forEach(function(k) {
                if (!synced) {
                    // â”€â”€ ì²« ì—°ê²°: ë™ì¼ idëŠ” updatedAt ê¸°ì¤€, ë™ë¥ ì´ë©´ ë¡œì»¬ ìš°ì„  â”€â”€
                    merged[k] = _mergeArraysWithVersions(localData[k], remote[k], true);
                    if (_hasLocalOnlyItems(localData[k], remote[k])) needUpload = true;
                    if (_hasLocalNewerThanRemote(localData[k], remote[k])) needUpload = true;
                } else {
                    // â”€â”€ ì´í›„: ë™ì¼ idëŠ” ë” ìµœê·¼ íŽ¸ì§‘(updatedAt ë“±) ìª½ì´ ì´ê¹€, ë™ë¥ ì´ë©´ ì›ê²© ìš°ì„ 
                    merged[k] = _mergeArraysWithVersions(localData[k], remote[k], false);
                    var remoteMap = {};
                    (remote[k] || []).forEach(function(item) {
                        if (item && item.id) remoteMap[item.id] = item;
                    });
                    var localOnly = (localData[k] || []).filter(function(item) {
                        return item && item.id && !remoteMap[item.id];
                    });
                    if (localOnly.length > 0) needUpload = true;
                    if (_hasLocalNewerThanRemote(localData[k], remote[k])) needUpload = true;
                }
            });

            // ë¡œì»¬ì— ì €ìž¥ëœ ì˜ìˆ˜ì¦ ì‚¬ì§„ ë³µì› (Firestoreì—ëŠ” ìš©ëŸ‰ ë¬¸ì œë¡œ ë¯¸ì €ìž¥)
            merged.expenses = merged.expenses.map(function(e) {
                var localE = (localData.expenses || []).find(function(le) { return le.id === e.id; });
                if (localE && localE.receipts && localE.receipts.length) e.receipts = localE.receipts;
                return e;
            });

            appData = merged;
            localStorage.setItem('appData', JSON.stringify(appData));
            _syncPrevSaveSnapshot();

            var nextSnap = _appDataForSyncCompare(appData);
            var pullAt = Date.now();
            try {
                localStorage.setItem('_fbLastPullAt', String(pullAt));
            } catch (e2) {}
            _refreshFbLastSyncUI();
            var suppressToast = false;
            try {
                suppressToast = sessionStorage.getItem('_fbSuppressRemoteToastOnce') === '1';
                if (suppressToast) sessionStorage.removeItem('_fbSuppressRemoteToastOnce');
            } catch (e3) {}
            if (synced && prevSnap !== nextSnap && !meta.fromCache && !suppressToast) {
                if (pullAt - _fbLastFamilyToastAt > 4500) {
                    _fbLastFamilyToastAt = pullAt;
                    // ì–´ëŠ í°(í•œêµ­/ìºë‚˜ë‹¤)ì—ì„œ ì™”ëŠ”ì§€ ížŒíŠ¸ í‘œì‹œ
                    var remoteDevice = 'ë‹¤ë¥¸ í°';
                    try {
                        var remoteDoc = JSON.parse(nextSnap);
                        if (remoteDoc && remoteDoc._deviceLabel) remoteDevice = remoteDoc._deviceLabel;
                    } catch(e3) {}
                    showToast('ðŸ”” ' + remoteDevice + 'ì—ì„œ ë°”ë€ ë‚´ìš©ì´ ë°˜ì˜ëì–´ìš”!', 3500);
                }
            }

            if (!synced) {
                // ì²« ë™ê¸°í™” ì™„ë£Œ í‘œì‹œ
                localStorage.setItem('_fbSyncInit', '1');
                if (needUpload) {
                    _saveToFirestore(0);
                    showToast('ðŸ”„ ë¡œì»¬ ë°ì´í„°ë¥¼ í´ë¼ìš°ë“œì™€ í•©ì³¤ìŠµë‹ˆë‹¤');
                }
            } else if (needUpload) {
                // ì˜¤í”„ë¼ì¸ ì¤‘ ì¶”ê°€ëœ í•­ëª© ì—…ë¡œë“œ
                _saveToFirestore(0);
            }

            updateUI();
        }

        function _saveToFirestore(retryAttempt) {
            if (!_db) return Promise.resolve();
            retryAttempt = retryAttempt || 0;
            // Firestore ë¬¸ì„œ 1MB ì œí•œ â†’ ì˜ìˆ˜ì¦ base64 ì´ë¯¸ì§€ ì œê±° í›„ ì €ìž¥
            var cloudData = JSON.parse(JSON.stringify(appData));
            cloudData.expenses = (cloudData.expenses || []).map(function(e) {
                var copy = Object.assign({}, e);
                delete copy.receipts;
                return copy;
            });
            // ê¸°ê¸° ë ˆì´ë¸” ì²¨ë¶€ â†’ ìƒëŒ€ í° í† ìŠ¤íŠ¸ì— í‘œì‹œìš©
            try {
                cloudData._deviceLabel = new Date().getTimezoneOffset() <= -480 ? 'ðŸ‡°ðŸ‡· í•œêµ­ í°' : 'ðŸ‡¨ðŸ‡¦ ìºë‚˜ë‹¤ í°';
            } catch(e0) {}
            return _db.collection('rentalApp').doc('main').set(cloudData)
                .then(function() {
                    try {
                        sessionStorage.setItem('_fbSuppressRemoteToastOnce', '1');
                    } catch (e0) {}
                    _showFbStatus('synced');
                    try {
                        localStorage.setItem('_fbLastPushOk', String(Date.now()));
                    } catch (e1) {}
                    _refreshFbLastSyncUI();
                })
                .catch(function(err) {
                    console.error('Firestore save error:', err);
                    if (retryAttempt < 3) {
                        var delay = 500 * Math.pow(2, retryAttempt);
                        return new Promise(function(resolve) {
                            setTimeout(function() {
                                resolve(_saveToFirestore(retryAttempt + 1));
                            }, delay);
                        });
                    }
                    _showFbStatus('error');
                    showToast('âš ï¸ í´ë¼ìš°ë“œ ì €ìž¥ì— ì‹¤íŒ¨í–ˆì–´ìš”. ì¸í„°ë„· í™•ì¸ í›„ ã€Œì§€ê¸ˆ í´ë¼ìš°ë“œì— ì €ìž¥ã€ì„ ëˆŒëŸ¬ ì£¼ì„¸ìš”.', 3800);
                    throw err;
                });
        }

        // ============ CHANGELOG / ROLLBACK ============
        var _changelogMax = 20;
        var _changelogTimer = null;
        var _changelogPendingSummary = null;

        /** ì´ì „ ìŠ¤ëƒ…ìƒ·ê³¼ ë¹„êµí•´ ë³€ê²½ ë‚´ìš©ì„ í•œ ì¤„ë¡œ ìš”ì•½ */
        function _generateChangeSummary() {
            if (!_prevSaveSnapshot) return 'ë°ì´í„° ë³€ê²½';
            var prev;
            try { prev = JSON.parse(_prevSaveSnapshot); } catch(e) { return 'ë°ì´í„° ë³€ê²½'; }
            var labelMap = { buildings:'ê±´ë¬¼', rooms:'í˜¸ì‹¤', tenants:'ì„¸ìž…ìž', rents:'ìˆ˜ë‚©', expenses:'ì§€ì¶œ' };
            var parts = [];
            Object.keys(labelMap).forEach(function(k) {
                var prevList = prev[k] || [];
                var currList = appData[k] || [];
                var prevIds = {}; prevList.forEach(function(i) { if (i && i.id) prevIds[i.id] = i; });
                var currIds = {}; currList.forEach(function(i) { if (i && i.id) currIds[i.id] = i; });
                var added   = currList.filter(function(i) { return i && i.id && !prevIds[i.id]; });
                var deleted = prevList.filter(function(i) { return i && i.id && !currIds[i.id]; });
                var changed = currList.filter(function(i) {
                    if (!i || !i.id || !prevIds[i.id]) return false;
                    return JSON.stringify(_stripUpdatedAtForCompare(i)) !== JSON.stringify(_stripUpdatedAtForCompare(prevIds[i.id]));
                });
                var _name = function(i) { return i.name || i.roomNumber || i.month || i.date || ''; };
                if (added.length) {
                    var ns = added.map(_name).filter(Boolean).slice(0,2).join(', ');
                    parts.push(labelMap[k]+' ì¶”ê°€'+(ns?': '+ns:'')+(added.length>2?' ì™¸ '+(added.length-2)+'ê±´':''));
                }
                if (deleted.length) parts.push(labelMap[k]+' ì‚­ì œ '+deleted.length+'ê±´');
                if (changed.length) {
                    var ns2 = changed.map(_name).filter(Boolean).slice(0,2).join(', ');
                    parts.push(labelMap[k]+' ìˆ˜ì •'+(ns2?': '+ns2:''));
                }
            });
            return parts.length ? parts.join(' / ') : 'ë³€ê²½ ì—†ìŒ';
        }

        /** Firestore rentalAppChangelog ì»¬ë ‰ì…˜ì— ìŠ¤ëƒ…ìƒ· ì €ìž¥ */
        function _saveChangelogEntry(summary) {
            if (!_db || !summary || summary === 'ë³€ê²½ ì—†ìŒ') return;
            var cloudData = JSON.parse(JSON.stringify(appData));
            cloudData.expenses = (cloudData.expenses || []).map(function(e) {
                var c = Object.assign({}, e); delete c.receipts; return c;
            });
            var tz = new Date().getTimezoneOffset(); // í•œêµ­: -540, ìºë‚˜ë‹¤: +240~+300
            var deviceLabel = tz <= -480 ? 'ðŸ‡°ðŸ‡· í•œêµ­' : 'ðŸ‡¨ðŸ‡¦ ìºë‚˜ë‹¤';
            _db.collection('rentalAppChangelog').add({
                ts: Date.now(),
                summary: summary,
                device: deviceLabel,
                snapshot: cloudData
            }).then(function() {
                _trimChangelog();
            }).catch(function(e) {
                console.warn('Changelog save failed:', e);
            });
        }

        /** 20ê°œ ì´ˆê³¼ ì‹œ ì˜¤ëž˜ëœ í•­ëª© ì‚­ì œ */
        function _trimChangelog() {
            if (!_db) return;
            _db.collection('rentalAppChangelog').orderBy('ts','asc').get().then(function(snap) {
                if (snap.size > _changelogMax) {
                    snap.docs.slice(0, snap.size - _changelogMax).forEach(function(d) {
                        d.ref.delete().catch(function(){});
                    });
                }
            }).catch(function(){});
        }

        /** ì„¤ì • íŽ˜ì´ì§€ì—ì„œ ì´ë ¥ ëª©ë¡ ë¡œë“œ */
        function loadChangelog() {
            var container = document.getElementById('changelogList');
            if (!container) return;
            if (!_db) {
                container.innerHTML = '<p class="changelog-empty">Firebaseê°€ ì—°ê²°ë˜ì–´ ìžˆì§€ ì•ŠìŠµë‹ˆë‹¤.</p>';
                return;
            }
            container.innerHTML = '<p class="changelog-empty"><span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> ë¶ˆëŸ¬ì˜¤ëŠ” ì¤‘...</p>';
            _db.collection('rentalAppChangelog').orderBy('ts','desc').limit(_changelogMax).get()
                .then(function(snap) {
                    if (snap.empty) {
                        container.innerHTML = '<p class="changelog-empty">ë³€ê²½ ì´ë ¥ì´ ì—†ìŠµë‹ˆë‹¤.<br>ë°ì´í„°ë¥¼ ìˆ˜ì •í•˜ë©´ ìžë™ìœ¼ë¡œ ê¸°ë¡ë©ë‹ˆë‹¤.</p>';
                        return;
                    }
                    var html = snap.docs.map(function(doc) {
                        var d = doc.data();
                        var dt = '-';
                        try { dt = new Date(d.ts).toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e2){}
                        return '<div class="changelog-entry">'
                            + '<div class="changelog-meta">'
                            +   '<span class="changelog-device">' + (d.device||'ì•Œ ìˆ˜ ì—†ìŒ') + '</span>'
                            +   '<span class="changelog-time">' + dt + '</span>'
                            + '</div>'
                            + '<div class="changelog-summary">' + (d.summary||'') + '</div>'
                            + '<button class="changelog-rollback-btn" onclick="rollbackToSnapshot(\'' + doc.id + '\',\'' + dt + '\')">'
                            +   'âª ì´ ì‹œì ìœ¼ë¡œ ë³µì›'
                            + '</button>'
                            + '</div>';
                    }).join('');
                    container.innerHTML = html;
                })
                .catch(function(e) {
                    container.innerHTML = '<p class="changelog-empty" style="color:var(--danger);">ë¶ˆëŸ¬ì˜¤ê¸° ì‹¤íŒ¨: ' + e.message + '</p>';
                });
        }

        /** ì„ íƒí•œ ìŠ¤ëƒ…ìƒ·ìœ¼ë¡œ appData ë³µì› */
        function rollbackToSnapshot(docId, label) {
            if (!_db) { showToast('âš ï¸ Firebase ì—°ê²° í•„ìš”'); return; }
            var msg = (label ? label + ' ì‹œì ' : 'ì„ íƒí•œ ì‹œì ') + 'ì˜ ë°ì´í„°ë¡œ ë³µì›í• ê¹Œìš”?\ní˜„ìž¬ ìƒíƒœëŠ” ì´ë ¥ì— ìžë™ ì €ìž¥ë©ë‹ˆë‹¤.';
            showConfirm(msg, function() {
            _db.collection('rentalAppChangelog').doc(docId).get()
                .then(function(doc) {
                    if (!doc.exists) { showToast('âš ï¸ í•´ë‹¹ ì´ë ¥ì„ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤'); return; }
                    var snap = doc.data() && doc.data().snapshot;
                    if (!snap) { showToast('âš ï¸ ìŠ¤ëƒ…ìƒ· ë°ì´í„°ê°€ ì—†ìŠµë‹ˆë‹¤'); return; }
                    // ë³µì› ì „ í˜„ìž¬ ìƒíƒœë¥¼ ì´ë ¥ì— ë°±ì—…
                    var cloudNow = JSON.parse(JSON.stringify(appData));
                    cloudNow.expenses = (cloudNow.expenses || []).map(function(e) {
                        var c = Object.assign({}, e); delete c.receipts; return c;
                    });
                    var tzNow = new Date().getTimezoneOffset();
                    _db.collection('rentalAppChangelog').add({
                        ts: Date.now(),
                        summary: 'ë³µì› ì „ ìžë™ ë°±ì—…',
                        device: tzNow <= -480 ? 'ðŸ‡°ðŸ‡· í•œêµ­' : 'ðŸ‡¨ðŸ‡¦ ìºë‚˜ë‹¤',
                        snapshot: cloudNow
                    }).catch(function(){});
                    // ì˜ìˆ˜ì¦ ì‚¬ì§„ì€ ë¡œì»¬ì—ì„œ ì´ì–´ë°›ê¸°
                    var local;
                    try { local = JSON.parse(localStorage.getItem('appData') || '{}'); } catch(e) { local = {}; }
                    snap.expenses = (snap.expenses || []).map(function(e) {
                        var le = (local.expenses || []).find(function(x) { return x.id === e.id; });
                        if (le && le.receipts && le.receipts.length) e.receipts = le.receipts;
                        return e;
                    });
                    appData = snap;
                    saveData();
                    updateUI();
                    showToast('âœ… ë³µì› ì™„ë£Œ! ë°ì´í„°ë¥¼ ë˜ëŒë ¸ìŠµë‹ˆë‹¤.', 3000);
                    setTimeout(loadChangelog, 800); // ëª©ë¡ ê°±ì‹ 
                })
                .catch(function(e) {
                    showToast('âš ï¸ ë³µì› ì‹¤íŒ¨: ' + e.message);
                });
            }, 'ë³µì›', false);
        }

        /** ë””ë°”ìš´ìŠ¤ ëŒ€ê¸° ì¤‘ì¸ Firestore ì €ìž¥ì„ ì¦‰ì‹œ ì‹œë„ (íƒ­ ì¢…ë£ŒÂ·ë°±ê·¸ë¼ìš´ë“œ ì „í™˜ ì‹œ ìœ ì‹¤ ì™„í™”) */
        function _flushFirestorePending() {
            if (!_db) return Promise.resolve();
            if (_fbDebounceTimer) {
                clearTimeout(_fbDebounceTimer);
                _fbDebounceTimer = null;
            }
            return _saveToFirestore(0);
        }

        function _refreshFbLastSyncUI() {
            var line = document.getElementById('fbLastSyncLine');
            if (!line) return;
            if (!_db) {
                line.style.display = 'none';
                return;
            }
            var pull = 0, push = 0;
            try {
                pull = parseInt(localStorage.getItem('_fbLastPullAt') || '0', 10) || 0;
                push = parseInt(localStorage.getItem('_fbLastPushOk') || '0', 10) || 0;
            } catch (e) {}
            if (!pull && !push) {
                line.style.display = 'none';
                return;
            }
            var fmt = function(t) {
                if (!t) return '-';
                try {
                    return new Date(t).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                } catch (e2) {
                    return '-';
                }
            };
            line.style.display = 'block';
            line.innerHTML = 'ë§ˆì§€ë§‰ ë§žì¶¤: ë°›ìŒ <strong>' + fmt(pull) + '</strong> Â· ì˜¬ë¦¼ <strong>' + fmt(push) + '</strong>';
        }

        function _showFbStatus(status) {
            var el = document.getElementById('fbSyncPill');
            if (!el) return;
            if (_fbStatusHideTimer) {
                clearTimeout(_fbStatusHideTimer);
                _fbStatusHideTimer = null;
            }
            var map = {
                'connecting':  ['ðŸ”„ ì—°ê²° ì¤‘', '#f59e0b'],
                'connected':   ['ðŸ”¥ ì—°ê²°ë¨',   '#10b981'],
                'syncing':     ['ðŸ”„ ì €ìž¥ ì¤‘',  '#3b82f6'],
                'synced':      ['âœ… ë™ê¸°í™”ë¨', '#10b981'],
                'offline':     ['ðŸ“µ ì˜¤í”„ë¼ì¸', '#64748b'],
                'error':       ['âš ï¸ ì˜¤ë¥˜',     '#ef4444']
            };
            var s = map[status];
            if (!s) { el.style.display = 'none'; return; }
            el.style.display = 'flex';
            el.style.background = s[1];
            el.textContent = s[0];
            // 3ì´ˆ í›„ ìˆ¨ê¸°ê¸° (synced/connected ìƒíƒœë§Œ)
            if (status === 'synced' || status === 'connected') {
                _fbStatusHideTimer = setTimeout(function() {
                    _fbStatusHideTimer = null;
                    if (el) el.style.display = 'none';
                }, 3000);
            }
        }

        function _updateFirebaseSettingsUI() {
            var statusEl  = document.getElementById('firebaseConnStatus');
            var descEl    = document.getElementById('fbStatusDesc');
            if (!statusEl) return;
            if (!_fbConfigured()) {
                statusEl.textContent = 'âš« ë¹„í™œì„±';
                if (descEl) descEl.textContent = 'HTML íŒŒì¼ì˜ FIREBASE_CONFIGë¥¼ ì±„ìš°ë©´ ìžë™ìœ¼ë¡œ í™œì„±í™”ë©ë‹ˆë‹¤.';
            } else if (_db) {
                statusEl.textContent = typeof navigator !== 'undefined' && navigator.onLine === false ? 'ðŸŸ¡ ì—°ë™ë¨(ì˜¤í”„ë¼ì¸ ëŒ€ê¸°)' : 'ðŸŸ¢ ì—°ë™ë¨';
                if (descEl) {
                    descEl.textContent = typeof navigator !== 'undefined' && navigator.onLine === false
                        ? 'ì§€ê¸ˆì€ ì¸í„°ë„·ì´ ëŠê²¨ ìžˆì–´ìš”. ì´ í°ì—ì„œ ê³ ì¹œ ë‚´ìš©ì€ ì—°ê²°ë˜ë©´ ìžë™ìœ¼ë¡œ ì˜¬ë¼ê°€ìš”. ì—„ë§ˆ í°ê³¼ë„ ê·¸ë•Œ ë§žì¶°ì§‘ë‹ˆë‹¤.'
                        : 'ì—„ë§ˆ í°ê³¼ ë‚´ í°, ë‘˜ ë‹¤ ì¼œ ë‘ë©´ ê°™ì€ ëª©ë¡ì´ ìžë™ìœ¼ë¡œ ë§žì¶°ì ¸ìš”. í•œìª½ì—ì„œ ìˆ˜ì •í•˜ë©´ ìž ì‹œ í›„ ë‹¤ë¥¸ ìª½ì—ë„ ë°˜ì˜ë©ë‹ˆë‹¤.';
                }
                _refreshFbLastSyncUI();
            } else {
                statusEl.textContent = 'ðŸ”´ ì—°ê²° ì˜¤ë¥˜';
                if (descEl) descEl.textContent = 'ì„¤ì •ê°’ì„ í™•ì¸í•´ ì£¼ì„¸ìš”.';
            }
        }

        // ============ ONEDRIVE SYNC ============
        let syncTimer = null;
        function debounceSync() {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
                if (account) {
                    syncWithOneDrive();
                }
            }, 3000);
        }
        function initMSAL() {
            const clientId = localStorage.getItem('azureClientId');
            if (!clientId) return;
            const msalConfig = {
                auth: {
                    clientId: clientId,
                    authority: 'https://login.microsoftonline.com/common',
                    redirectUri: window.location.origin
                },
                cache: {
                    cacheLocation: 'localStorage',
                    storeAuthStateInCookie: false
                }
            };
            msalInstance = new msal.PublicClientApplication(msalConfig);
            msalInstance.initialize().then(() => {
                checkLoginStatus();
            });
        }
        function checkLoginStatus() {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                account = accounts[0];
                updateMSALUI('logged_in');
            } else {
                updateMSALUI('logged_out');
            }
        }
        function loginToOneDrive() {
            if (!msalInstance) {
                showToast('Azure í´ë¼ì´ì–¸íŠ¸ IDë¥¼ ë¨¼ì € ì„¤ì •í•˜ì„¸ìš”');
                return;
            }
            msalInstance.loginPopup({
                scopes: ['Files.ReadWrite.AppFolder']
            }).then(() => {
                checkLoginStatus();
                showToast('ë¡œê·¸ì¸ë˜ì—ˆìŠµë‹ˆë‹¤');
            }).catch(err => {
                showToast('ë¡œê·¸ì¸ ì‹¤íŒ¨: ' + err.message);
            });
        }
        function logoutFromOneDrive() {
            if (msalInstance && account) {
                msalInstance.logoutPopup({
                    mainWindowRedirectUri: window.location.origin
                }).then(() => {
                    account = null;
                    updateMSALUI('logged_out');
                    showToast('ë¡œê·¸ì•„ì›ƒë˜ì—ˆìŠµë‹ˆë‹¤');
                });
            }
        }
        function syncWithOneDrive() {
            if (!msalInstance || !account) return;
            updateMSALUI('syncing');
            msalInstance.acquireTokenSilent({
                scopes: ['Files.ReadWrite.AppFolder'],
                account: account
            }).then(response => {
                saveDataToOneDrive(response.accessToken);
            }).catch(err => {
                console.error('Token acquisition error:', err);
                updateMSALUI('error');
            });
        }
        function saveDataToOneDrive(accessToken) {
            const dataStr = JSON.stringify(appData);
            const formData = new FormData();
            formData.append('file', new Blob([dataStr], { type: 'application/json' }));
            fetch('https://graph.microsoft.com/v1.0/me/drive/special/approot:/ìž„ëŒ€ê´€ë¦¬ì•±_data.json:/content', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                body: dataStr
            }).then(response => {
                if (response.ok) {
                    updateMSALUI('logged_in');
                    showToast('OneDrive ë™ê¸°í™” ì™„ë£Œ');
                } else {
                    updateMSALUI('error');
                    showToast('ë™ê¸°í™” ì‹¤íŒ¨');
                }
            }).catch(err => {
                console.error('Sync error:', err);
                updateMSALUI('error');
            });
        }
        function updateMSALUI(status) {
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const syncBtn = document.getElementById('syncBtn2');
            const statusDiv = document.getElementById('msalStatus');
            if (status === 'logged_in') {
                loginBtn.style.display = 'none';
                logoutBtn.style.display = 'block';
                syncBtn.style.display = 'block';
                statusDiv.textContent = 'âœ“ ' + (account?.username || 'ë¡œê·¸ì¸ë¨');
                statusDiv.style.color = 'var(--success)';
            } else if (status === 'syncing') {
                syncBtn.innerHTML = '<span id="syncStatus"><span class="spinner"></span> ë™ê¸°í™” ì¤‘...</span>';
                statusDiv.textContent = 'ë™ê¸°í™” ì¤‘...';
                statusDiv.style.color = 'var(--info)';
            } else if (status === 'error') {
                statusDiv.textContent = 'âœ— ë™ê¸°í™” ì˜¤ë¥˜';
                statusDiv.style.color = 'var(--danger)';
                syncBtn.innerHTML = '<span id="syncStatus">OneDrive ë™ê¸°í™”</span>';
            } else {
                loginBtn.style.display = 'block';
                logoutBtn.style.display = 'none';
                syncBtn.style.display = 'none';
                statusDiv.textContent = 'ë¡œê·¸ì¸í•˜ì§€ ì•ŠìŒ';
                statusDiv.style.color = 'var(--neutral-gray)';
            }
        }
        function saveSettings() {
            const clientId = document.getElementById('azureClientId').value;
            localStorage.setItem('azureClientId', clientId);
            if (clientId && !msalInstance) {
                initMSAL();
            }
            showToast('ì„¤ì •ì´ ì €ìž¥ë˜ì—ˆìŠµë‹ˆë‹¤');
        }
        // ============ UTILITIES ============
        function formatResidentId(input) {
            let val = input.value.replace(/[^0-9]/g, '');
            if (val.length > 6) val = val.slice(0, 6) + '-' + val.slice(6, 13);
            input.value = val;
        }
        // ============ SEARCH ============
        document.addEventListener('DOMContentLoaded', () => {
            loadData();
            if (cleanupInvalidRents()) {
                // ìž˜ëª»ëœ ë ˆì½”ë“œê°€ ì œê±°ëìœ¼ë©´ localStorageì— ì¦‰ì‹œ ë°˜ì˜ (ë‹¤ìŒ ë¡œë”© ë•Œë„ ê¹¨ë—í•˜ê²Œ)
                localStorage.setItem('appData', JSON.stringify(appData));
            }
            _syncPrevSaveSnapshot();
            renderDashboard();
            const tenantSearch = document.getElementById('tenantSearch');
            if (tenantSearch) {
                tenantSearch.addEventListener('input', renderTenants);
            }
            loadExpenseFilterRooms();
            document.getElementById('azureClientId').value = localStorage.getItem('azureClientId') || '';
            initMSAL();
            // Set current date
            document.getElementById('yearDisplay').textContent = new Date().getFullYear() + 'ë…„';
            // Firebase ì‹¤ì‹œê°„ ë™ê¸°í™” (FIREBASE_CONFIGê°€ ì„¤ì •ë˜ì–´ ìžˆìœ¼ë©´ ìžë™ ì—°ê²°)
            initFirebase();
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                _showFbStatus('offline');
            }
            window.addEventListener('online', function() {
                _showFbStatus('synced');
                _updateFirebaseSettingsUI();
            });
            window.addEventListener('offline', function() {
                _showFbStatus('offline');
                _updateFirebaseSettingsUI();
            });
            // ë‹¤ë¥¸ íƒ­ì—ì„œ ì €ìž¥í•œ appData ë°˜ì˜ (ë™ê¸°í™”)
            window.addEventListener('storage', function(e) {
                if (e.key !== 'appData' || e.newValue == null) return;
                try {
                    var parsed = JSON.parse(e.newValue);
                    var requiredKeys = ['buildings', 'rooms', 'tenants', 'rents', 'expenses'];
                    if (!requiredKeys.every(function(k) { return Array.isArray(parsed[k]); })) return;
                    appData = parsed;
                    cleanupInvalidRents();
                    _syncPrevSaveSnapshot();
                    updateUI();
                } catch (err) {
                    console.warn('storage appData parse:', err);
                }
            });
            window.addEventListener('pagehide', _flushFirestorePending);
            window.addEventListener('beforeunload', _flushFirestorePending);
            // Android í•˜ë“œì›¨ì–´ ë’¤ë¡œê°€ê¸° â†’ ì—´ë¦° ëª¨ë‹¬ ë‹«ê¸°
            window.addEventListener('popstate', function(e) {
                const active = document.querySelector('.modal-overlay.active, .td-overlay.active');
                if (active) {
                    closeModal(active.id);
                }
            });
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'hidden') _flushFirestorePending();
            });
        });
        function showTenantSection(section) {
            const currentBtn = document.getElementById('tabCurrentTenant');
            const pastBtn = document.getElementById('tabPastTenant');
            const currentSec = document.getElementById('currentTenantSection');
            const pastSec = document.getElementById('pastTenantSection');
            if (section === 'current') {
                currentSec.style.display = 'block';
                pastSec.style.display = 'none';
                currentBtn.classList.add('active');
                pastBtn.classList.remove('active');
                currentTenantFilter = 'active';
                renderTenants();
            } else {
                currentSec.style.display = 'none';
                pastSec.style.display = 'block';
                currentBtn.classList.remove('active');
                pastBtn.classList.add('active');
                currentTenantFilter = 'all';
                renderPastTenants();
            }
        }
        function renderPastTenants() {
            const listEl = document.getElementById('pastTenantsList');
            if (!listEl) return;
            const today = new Date().toISOString().split('T')[0];
            const data = appData;
            const pastTenants = (appData.tenants || []).filter(function(t) {
                return t.status === 'inactive' || (t.status === 'active' && t.contractEnd && t.contractEnd < today);
            });
            if (pastTenants.length === 0) {
                listEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">ðŸ“‹</div><p>ê³¼ê±° ì„¸ìž…ìžê°€ ì—†ìŠµë‹ˆë‹¤</p></div>';
                return;
            }
            // Sort by contract end desc (most recent first)
            pastTenants.sort(function(a, b) {
                return (b.contractEnd || '').localeCompare(a.contractEnd || '');
            });
            listEl.innerHTML = '';
            pastTenants.forEach(function(t) {
                const room = (data.rooms || []).find(function(r) { return r.id === t.roomId; });
                const bld  = room ? (data.buildings || []).find(function(b) { return b.id === room.buildingId; }) : null;
                const roomNum = room ? room.roomNumber + 'í˜¸' : 'ë¯¸ìƒ';
                const bldName = bld ? bld.name : '';
                const start = t.contractStart ? t.contractStart.substring(0,10) : '-';
                const end = t.contractEnd ? t.contractEnd.substring(0,10) : '-';
                const isExpiredActive = t.status === 'active';
                const badgeText = t.status !== 'active' ? 'í‡´ê±°' : 'ê³„ì•½ë§Œë£Œ';
                const card = document.createElement('div');
                card.className = 'tc-past-card';
                card.style.cursor = 'pointer';
                card.innerHTML =
                    '<div class="tc-past-header">' +
                        '<div style="flex:1;min-width:0;">' +
                            '<div class="tc-past-name">' + escapeHTML(t.name) + '</div>' +
                            '<div class="tc-past-room">ðŸ¢ ' + escapeHTML((bldName ? bldName + ' ' : '') + roomNum) + '</div>' +
                        '</div>' +
                        '<div style="display:flex;align-items:center;gap:8px;">' +
                            '<span class="tc-past-badge">' + badgeText + '</span>' +
                            '<span style="color:#CBD5E1;font-size:20px;line-height:1;">â€º</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tc-past-dates">ðŸ“… ' + escapeHTML(start) + ' ~ ' + escapeHTML(end) + '</div>' +
                    (t.deposit > 0 ? '<div style="margin-top:8px;font-size:12px;color:#6B7280;">ðŸ¦ ë³´ì¦ê¸ˆ â‚©' + t.deposit.toLocaleString() + (t.depositRefunded ? ' <span style="color:#16A34A;font-weight:700;">ë°˜í™˜ì™„ë£Œ</span>' : ' <span style="color:#DC2626;font-weight:700;">ë¯¸ë°˜í™˜</span>') + '</div>' : '') +
                    (isExpiredActive ? '<div style="margin-top:10px;"><button class="tc-btn-outline" style="width:100%;" data-tid="' + t.id + '">ê³„ì•½ ê°±ì‹ </button></div>' : '');
                // ì¹´ë“œ í´ë¦­ â†’ ì„¸ë¶€ì •ë³´ ë³´ê¸°
                card.addEventListener('click', function(e) {
                    if (e.target.closest('[data-tid]')) return; // ê°±ì‹  ë²„íŠ¼ì€ ë³„ë„ ì²˜ë¦¬
                    showTenantDetail(t.id);
                });
                if (isExpiredActive) {
                    card.querySelector('[data-tid]').addEventListener('click', function(e) {
                        e.stopPropagation(); openRenewModal(t.id);
                    });
                }
                listEl.appendChild(card);
            });
        }
        function openRenewModal(tenantId) {
            var tenant = (appData.tenants || []).find(function(t) { return t.id === tenantId; });
            if (!tenant) return;
            const oldEnd = tenant.contractEnd || new Date().toISOString().split('T')[0];
            const newEndDate = new Date(oldEnd);
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            document.getElementById('renewTenantId').value = tenantId;
            document.getElementById('renewModalTenantName').textContent = tenant.name;
            document.getElementById('renewStart').value = oldEnd;
            document.getElementById('renewEnd').value = newEndDate.toISOString().split('T')[0];
            document.getElementById('renewRent').value = tenant.monthlyRent || 0;
            document.getElementById('renewFee').value = tenant.managementFee || 0;
            openModal('renewContractModal');
        }
        function submitRenewal() {
            const tenantId = document.getElementById('renewTenantId').value;
            const newStart = document.getElementById('renewStart').value;
            const newEnd = document.getElementById('renewEnd').value;
            const newRent = parseInt(document.getElementById('renewRent').value) || 0;
            const newFee = parseInt(document.getElementById('renewFee').value) || 0;
            if (!newStart || !newEnd) { showToast('âš ï¸ ê³„ì•½ ê¸°ê°„ì„ ìž…ë ¥í•´ì£¼ì„¸ìš”.'); return; }
            if (newStart >= newEnd) { showToast('âš ï¸ ë§Œë£Œì¼ì´ ì‹œìž‘ì¼ë³´ë‹¤ ë‚˜ì¤‘ì´ì–´ì•¼ í•©ë‹ˆë‹¤.'); return; }
            const idx = appData.tenants.findIndex(t => t.id === tenantId);
            if (idx === -1) { showToast('âš ï¸ ì„¸ìž…ìžë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.'); return; }
            const _prev = appData.tenants[idx];
            // ì›”ì„¸ ì¸ìƒ ì´ë ¥ ê¸°ë¡ (ì´ì „ ê³„ì•½ í•œ ì¤„)
            const _oldRent = _prev.monthlyRent || 0;
            const _oldFee = _prev.managementFee || 0;
            if (_oldRent !== newRent || _oldFee !== newFee) {
                _prev.rentHistory = (_prev.rentHistory || []).concat([{
                    monthlyRent: _oldRent,
                    managementFee: _oldFee,
                    from: _prev.contractStart || '',
                    to: newStart, // ìƒˆ ê³„ì•½ ì‹œìž‘ì¼ì„ ì¢…ë£Œì‹œì ìœ¼ë¡œ ì‚¬ìš©
                    reason: 'renew'
                }]);
            }
            appData.tenants[idx].contractStart = newStart;
            appData.tenants[idx].contractEnd = newEnd;
            appData.tenants[idx].monthlyRent = newRent;
            appData.tenants[idx].managementFee = newFee;
            appData.tenants[idx].status = 'active';
            // ìƒˆ ê³„ì•½ ì‹œìž‘ì›”ê³¼ ê²¹ì¹˜ëŠ” ê¸°ì¡´ pending/overdue ì›”ì„¸ ê¸°ë¡ ì œê±° (ì¤‘ë³µ ë°©ì§€)
            const newStartMonth = newStart.slice(0, 7);
            appData.rents = appData.rents.filter(r => {
                if (r.tenantId !== tenantId) return true;
                if (!(!r.type || r.type === 'monthly')) return true;
                if (r.status !== 'pending' && r.status !== 'overdue') return true;
                return r.month !== newStartMonth;
            });
            saveData();
            closeModal('renewContractModal');
            renderTenants();
            renderDashboard();
            showToast('âœ… ê³„ì•½ì´ ê°±ì‹ ë˜ì—ˆìŠµë‹ˆë‹¤!');
        }
        // ===== SMS ìž…ê¸ˆ íŒŒì‹± ê¸°ëŠ¥ =====
        let _smsParsed = null;
        function openSmsModal() {
          if (!document.getElementById('smsModal')) {
            const m = document.createElement('div');
            m.id = 'smsModal';
            m.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;';
            m.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;width:92%;max-width:460px;max-height:90vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.3);">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
              '<h3 style="margin:0;font-size:20px;color:#1e40af;">ðŸ“± ì€í–‰ ìž…ê¸ˆ ë¬¸ìž í™•ì¸</h3>' +
              '<button onclick="closeSmsModal()" style="background:none;border:none;font-size:26px;cursor:pointer;color:#6b7280;padding:4px;">âœ•</button></div>' +
              '<div id="smsStep1">' +
              '<p style="font-size:16px;color:#374151;margin-bottom:12px;">ìž…ê¸ˆ ì•Œë¦¼ ë¬¸ìžë¥¼ ì•„ëž˜ì— ë¶™ì—¬ë„£ìœ¼ì„¸ìš”</p>' +
              '<textarea id="smsInput" rows="7" placeholder="ì˜ˆ) [êµ­ë¯¼ì€í–‰] ìž…ê¸ˆ 230,000ì› í™*ë™ ìž”ì•¡ 1,234,567ì›"' +
              ' style="width:100%;box-sizing:border-box;padding:12px;font-size:15px;border:2px solid #d1d5db;border-radius:8px;resize:none;font-family:inherit;"></textarea>' +
              '<div style="display:flex;gap:8px;margin-top:12px;">' +
              '<button onclick="pasteFromClipboard()" style="flex:1;padding:14px;font-size:15px;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;cursor:pointer;">ðŸ“‹ í´ë¦½ë³´ë“œ</button>' +
              '<button onclick="analyzeSms()" style="flex:1;padding:14px;font-size:16px;background:#1e40af;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">ðŸ” ë¶„ì„í•˜ê¸°</button>' +
              '</div></div>' +
              '<div id="smsStep2" style="display:none;">' +
              '<div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:16px;margin-bottom:16px;">' +
              '<div style="font-size:14px;color:#6b7280;margin-bottom:8px;">ðŸ“Š ë¶„ì„ ê²°ê³¼</div>' +
              '<table style="width:100%;border-collapse:collapse;">' +
              '<tr><td style="padding:5px 0;color:#6b7280;font-size:14px;width:60px;">ì€í–‰</td><td style="font-size:15px;font-weight:bold;" id="smsResBank">-</td></tr>' +
              '<tr><td style="padding:5px 0;color:#6b7280;font-size:14px;">ìž…ê¸ˆì•¡</td><td style="font-size:20px;font-weight:bold;color:#059669;" id="smsResAmount">-</td></tr>' +
              '<tr><td style="padding:5px 0;color:#6b7280;font-size:14px;">ìž…ê¸ˆìž</td><td style="font-size:15px;font-weight:bold;" id="smsResSender">-</td></tr>' +
              '</table></div>' +
              '<div style="margin-bottom:16px;"><label style="display:block;font-size:15px;font-weight:bold;margin-bottom:8px;color:#374151;">ì„¸ìž…ìž ì„ íƒ</label>' +
              '<select id="smsTenantSel" style="width:100%;padding:12px;font-size:15px;border:2px solid #d1d5db;border-radius:8px;background:#fff;">' +
              '<option value="">-- ì„¸ìž…ìžë¥¼ ì„ íƒí•˜ì„¸ìš” --</option></select></div>' +
              '<div style="display:flex;gap:8px;">' +
              '<button onclick="resetSmsModal()" style="flex:1;padding:14px;font-size:15px;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;cursor:pointer;">â†© ë‹¤ì‹œ</button>' +
              '<button onclick="confirmSmsPayment()" style="flex:2;padding:14px;font-size:16px;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">âœ… ìˆ˜ë‚© ì²˜ë¦¬</button>' +
              '</div></div></div>';
            document.body.appendChild(m);
          }
          resetSmsModal();
          document.getElementById('smsModal').style.display = 'flex';
        }
        function closeSmsModal() {
          document.getElementById('smsModal').style.display = 'none';
        }
        function resetSmsModal() {
          document.getElementById('smsInput').value = '';
          document.getElementById('smsStep1').style.display = '';
          document.getElementById('smsStep2').style.display = 'none';
          _smsParsed = null;
        }
        function pasteFromClipboard() {
          if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(text => {
              document.getElementById('smsInput').value = text;
            }).catch(() => {
              showToast('í´ë¦½ë³´ë“œ ì ‘ê·¼ì´ ê±°ë¶€ë˜ì—ˆìŠµë‹ˆë‹¤. ì§ì ‘ ë¶™ì—¬ë„£ê¸°ë¥¼ ì‚¬ìš©í•´ ì£¼ì„¸ìš”.', 3000);
            });
          } else {
            showToast('ì§ì ‘ ë¶™ì—¬ë„£ê¸°(ê¸¸ê²Œ ëˆ„ë¥´ê¸°)ë¥¼ ì‚¬ìš©í•´ ì£¼ì„¸ìš”.', 2500);
          }
        }
        function analyzeSms() {
          const sms = document.getElementById('smsInput').value.trim();
          if (!sms) { showToast('âš ï¸ ë¬¸ìžë¥¼ ë¨¼ì € ë¶™ì—¬ë„£ì–´ ì£¼ì„¸ìš”.', 2500); return; }
          const result = { amount: null, sender: null, bank: 'ì•Œ ìˆ˜ ì—†ìŒ' };
          // ì€í–‰ ê°ì§€
          if (sms.includes('êµ­ë¯¼') || sms.includes('KB')) result.bank = 'KBêµ­ë¯¼ì€í–‰';
          else if (sms.includes('ì‹ í•œ')) result.bank = 'ì‹ í•œì€í–‰';
          else if (sms.includes('ë†í˜‘') || sms.includes('NH')) result.bank = 'NHë†í˜‘';
          else if (sms.includes('ìš°ë¦¬')) result.bank = 'ìš°ë¦¬ì€í–‰';
          else if (sms.includes('í•˜ë‚˜')) result.bank = 'í•˜ë‚˜ì€í–‰';
          else if (sms.includes('IBK') || sms.includes('ê¸°ì—…')) result.bank = 'IBKê¸°ì—…ì€í–‰';
          else if (sms.includes('ì¹´ì¹´ì˜¤')) result.bank = 'ì¹´ì¹´ì˜¤ë±…í¬';
          else if (sms.includes('í† ìŠ¤')) result.bank = 'í† ìŠ¤ë±…í¬';
          // ê¸ˆì•¡ ì¶”ì¶œ: "ìž…ê¸ˆ NNNì›" ìš°ì„ , ì—†ìœ¼ë©´ ìž”ì•¡ ì œì™¸ í›„ ì²«ë²ˆì§¸ ê¸ˆì•¡
          const depositM = sms.match(/ìž…ê¸ˆ\s+([\d,]+)\s*ì›/);
          if (depositM) {
            result.amount = parseInt(depositM[1].replace(/,/g, ''));
          } else {
            const noBalance = sms.replace(/ìž”ì•¡[\d,\sì›]*/g, '');
            const amtM = noBalance.match(/(\d[\d,]{2,})\s*ì›/);
            if (amtM) result.amount = parseInt(amtM[1].replace(/,/g, ''));
          }
          // ìž…ê¸ˆìž ì´ë¦„ ì¶”ì¶œ (í•œê¸€ 2~4ìž)
          const namePatterns = [
            /([ê°€-íž£]{2,4})\s+[\d,]+ì›/,
            /ìž…ê¸ˆ\s+([ê°€-íž£]{2,4})/,
            /ì›\s+([ê°€-íž£*]{2,5})\s/,
            /\n([ê°€-íž£]{2,4})\s/
          ];
          const skipWords = ['ìž”ì•¡','ìž…ê¸ˆ','ì´ì²´','ì¶œê¸ˆ','ê³„ì¢Œ','ë†í˜‘','êµ­ë¯¼','ì‹ í•œ','ìš°ë¦¬','í•˜ë‚˜','ì¹´ì¹´ì˜¤','í† ìŠ¤'];
          for (const p of namePatterns) {
            const m = sms.match(p);
            if (m && m[1] && !skipWords.includes(m[1])) { result.sender = m[1]; break; }
          }
          if (!result.amount) { showToast('âš ï¸ ê¸ˆì•¡ì„ ì°¾ì§€ ëª»í–ˆìŠµë‹ˆë‹¤. ë¬¸ìž ë‚´ìš©ì„ í™•ì¸í•´ ì£¼ì„¸ìš”.', 3000); return; }
          if (result.bank === 'ì•Œ ìˆ˜ ì—†ìŒ') { showToast('âš ï¸ ì€í–‰ì„ ì¸ì‹í•˜ì§€ ëª»í–ˆìŠµë‹ˆë‹¤. ì§ì ‘ í™•ì¸ í›„ ì €ìž¥í•´ ì£¼ì„¸ìš”.', 3500); }
          _smsParsed = result;
          document.getElementById('smsResBank').textContent = result.bank;
          document.getElementById('smsResAmount').textContent = result.amount.toLocaleString() + 'ì›';
          document.getElementById('smsResSender').textContent = result.sender || 'ì•Œ ìˆ˜ ì—†ìŒ';
          // ì„¸ìž…ìž ëª©ë¡ ì±„ìš°ê¸°
          const sel = document.getElementById('smsTenantSel');
          sel.innerHTML = '<option value="">-- ì„¸ìž…ìžë¥¼ ì„ íƒí•˜ì„¸ìš” --</option>';
          // Use global appData directly (do not shadow with local const)
          const rooms = appData.rooms || [];
          const activeTenants = (appData.tenants || []).filter(t => t.status === 'active');
          const amtMatches = activeTenants.filter(t =>
            t.monthlyRent + (t.managementFee || 0) === result.amount || t.monthlyRent === result.amount
          );
          activeTenants.forEach(t => {
            const opt = document.createElement('option');
            const room = rooms.find(r => r.id === t.roomId);
            opt.value = t.id;
            opt.textContent = t.name + ' (' + (room ? room.roomNumber : '?') + 'í˜¸)';
            // ë™ì¼ ê¸ˆì•¡ ì„¸ìž…ìžê°€ ì •í™•ížˆ 1ëª…ì¼ ë•Œë§Œ ìžë™ ì„ íƒ
            if (amtMatches.length === 1 && amtMatches[0].id === t.id) opt.selected = true;
            sel.appendChild(opt);
          });
          if (amtMatches.length > 1) showToast('âš ï¸ ë™ì¼ ê¸ˆì•¡ ì„¸ìž…ìžê°€ ' + amtMatches.length + 'ëª…ìž…ë‹ˆë‹¤. ì§ì ‘ ì„ íƒí•´ ì£¼ì„¸ìš”.', 3500);
          document.getElementById('smsStep1').style.display = 'none';
          document.getElementById('smsStep2').style.display = '';
        }
        function confirmSmsPayment() {
          const tenantId = document.getElementById('smsTenantSel').value;
          if (!tenantId) { showToast('âš ï¸ ì„¸ìž…ìžë¥¼ ì„ íƒí•´ ì£¼ì„¸ìš”.', 2500); return; }
          if (!_smsParsed || !_smsParsed.amount) { showToast('âš ï¸ ë¶„ì„ ê²°ê³¼ê°€ ì—†ìŠµë‹ˆë‹¤.', 2500); return; }
          const tenant = (appData.tenants || []).find(function(t) { return t.id === tenantId; });
          if (!tenant) { showToast('âš ï¸ ì„¸ìž…ìž ì •ë³´ë¥¼ ì°¾ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤.', 2500); return; }
          const now = new Date();
          const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
          const paidDate = now.toISOString().split('T')[0];
          const existing = (appData.rents || []).find(function(r) {
            return r.tenantId === tenantId && r.month === month && r.status === 'paid' && (!r.type || r.type === 'monthly');
          });
          function _doSave() {
            const newRent = {
              id: String(Date.now()),
              type: 'monthly',
              tenantId: tenantId,
              roomId: tenant.roomId,
              buildingId: tenant.buildingId,
              month: month,
              amount: _smsParsed.amount,
              rentAmount: _smsParsed.amount,
              managementFee: 0,
              paidDate: paidDate,
              status: 'paid',
              memo: 'SMS ìžë™: ' + _smsParsed.bank + (_smsParsed.sender ? ' / ' + _smsParsed.sender : '')
            };
            if (!appData.rents) appData.rents = [];
            appData.rents.push(newRent);
            saveData();
            closeSmsModal();
            if (typeof renderRents === 'function') renderRents();
            if (typeof renderDashboard === 'function') renderDashboard();
            showToast('âœ… ' + tenant.name + 'ë‹˜ ' + month + ' ìˆ˜ë‚© ì™„ë£Œ! â‚©' + newRent.amount.toLocaleString());
          }
          if (existing) {
            showConfirm(tenant.name + 'ë‹˜ì˜ ' + month + ' ìˆ˜ë‚©ì´ ì´ë¯¸ ì²˜ë¦¬ë˜ì–´ ìžˆìŠµë‹ˆë‹¤.\nê·¸ëž˜ë„ ì¶”ê°€í•˜ì‹œê² ìŠµë‹ˆê¹Œ?', _doSave, 'ì¶”ê°€', true);
          } else {
            _doSave();
          }
        }
        // ===== SMS ê¸°ëŠ¥ ë =====
        // ëŒ€ì‹œë³´ë“œ ì›” ë¼ë²¨ ë™ì  ì—…ë°ì´íŠ¸
        const _origRenderDash = typeof renderDashboard === 'function' ? renderDashboard : null;
        if (_origRenderDash) {
          renderDashboard = function() {
            _origRenderDash.apply(this, arguments);
            const _m = new Date().getMonth() + 1;
            const _lbl1 = document.getElementById('monthlyIncomeLabel');
            const _lbl2 = document.getElementById('monthlyExpectedLabel');
            if (_lbl1) _lbl1.textContent = _m + 'ì›” ë°›ì€ ê¸ˆì•¡';
            if (_lbl2) _lbl2.textContent = _m + 'ì›” ë°›ì„ ê¸ˆì•¡';
            // íƒ€ì¼ ì»¨í…Œì´ë„ˆ í•­ìƒ í‘œì‹œ
            const _tc = document.getElementById('monthlyTilesContainer');
            if (_tc) _tc.style.display = 'grid';
          };
        }
    <script>
    (function() {
        /* â”€â”€ 1. header subtitle map â”€â”€ */
        var PAGE_TITLES = {
            dashboardPage:  'ìž„ëŒ€ê´€ë¦¬ ëŒ€ì‹œë³´ë“œ',
            tenantsPage:    'ì„¸ìž…ìž ê´€ë¦¬',
            rentPage:       'ì›”ì„¸ ìˆ˜ë‚© í˜„í™©',
            expensesPage:   'ì§€ì¶œ ë‚´ì—­',
            settingsPage:   'ì„¤ì •'
        };
        /* Patch switchPage to update header subtitle */
        var _origSwitchPage = typeof switchPage === 'function' ? switchPage : null;
        if (_origSwitchPage) {
            switchPage = function(pageId) {
                _origSwitchPage.apply(this, arguments);
                var sub = document.getElementById('headerSubtitle');
                if (sub) sub.textContent = PAGE_TITLES[pageId] || '';
            };
        }

        /* showTenantSection now handles classList directly â€” no override needed */

        /* â”€â”€ 3. Extend renderDashboard for new elements â”€â”€ */
        var _origRD2 = typeof renderDashboard === 'function' ? renderDashboard : null;
        if (_origRD2) {
            renderDashboard = function() {
                _origRD2.apply(this, arguments);

                var today = new Date();
                var m = today.getMonth() + 1;
                var y = today.getFullYear();

                /* month/year labels */
                var mnEl = document.getElementById('dashMonthNum');
                var yrEl = document.getElementById('dashYearNum');
                if (mnEl) mnEl.textContent = m + 'ì›”';
                if (yrEl) yrEl.textContent = y + 'ë…„';

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘  ì´ë²ˆë‹¬ ë°ì´í„° ê³„ì‚°
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var monthStr = y + '-' + String(m).padStart(2, '0');
                var mm = String(m).padStart(2, '0');
                var monthRents = (appData.rents || []).filter(function(r) { return r.month === monthStr; });
                var paidRents  = monthRents.filter(function(r) { return r.status === 'paid'; });
                var paidAmt    = paidRents.reduce(function(s, r) { return s + r.amount; }, 0);

                var expectedAmt = (appData.tenants || [])
                    .filter(function(t) {
                        if (t.status !== 'active') return false;
                        // ì•„ì§ ìž…ì£¼í•˜ì§€ ì•Šì€ ì„¸ìž…ìž(ë¯¸ëž˜ moveInDate) ì œì™¸
                        var mi = (t.moveInDate || '').slice(0, 7);
                        if (mi && mi > monthStr) return false;
                        return true;
                    })
                    .reduce(function(sum, t) {
                        if ((t.rentType || 'monthly') === 'annual') {
                            var renewMM = (t.contractStart || '').slice(5, 7);
                            return renewMM === mm ? sum + (t.monthlyRent || 0) : sum;
                        }
                        return sum + (t.monthlyRent || 0) + (t.managementFee || 0);
                    }, 0);

                var unpaidRents = monthRents.filter(function(r) { return (r.status === 'pending' || r.status === 'overdue') && (!r.type || r.type === 'monthly'); });
                var rate = expectedAmt > 0 ? Math.round(paidAmt / expectedAmt * 100) : 0;
                var totalThisMonth = monthRents.length;

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘¡ ì´ë²ˆë‹¬ ë„ë„› (ì˜¤ë¥¸ìª½) ì—…ë°ì´íŠ¸  r=35 â†’ circâ‰ˆ219.9
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var circ = 2 * Math.PI * 60; // r=60 â†’ 376.9
                var donutArc = document.getElementById('donutArc');
                var donutPct = document.getElementById('donutPct');
                if (donutArc) {
                    var dashOffset = circ - (Math.min(rate, 100) / 100) * circ;
                    donutArc.setAttribute('stroke-dasharray', circ.toFixed(1));
                    donutArc.setAttribute('stroke-dashoffset', dashOffset.toFixed(1));
                    donutArc.setAttribute('stroke', rate >= 100 ? '#22C55E' : '#3B82F6');
                }
                if (donutPct) donutPct.textContent = rate + '%';

                /* KPI í…ìŠ¤íŠ¸ */
                var incomeEl   = document.getElementById('monthlyIncomeDisplay');
                var expectedEl = document.getElementById('monthlyExpectedDisplay');
                if (incomeEl)   incomeEl.textContent   = paidAmt.toLocaleString() + 'ì›';
                if (expectedEl) expectedEl.textContent = expectedAmt.toLocaleString() + 'ì›';

                /* ë¯¸ë‚©/ì™„ë£Œ ë±ƒì§€ */
                var currUnpaidRow = document.getElementById('currUnpaidRow');
                var currUnpaidInfo = document.getElementById('currUnpaidInfo');
                var currPaidRow  = document.getElementById('currPaidRow');
                var currPaidInfo = document.getElementById('currPaidInfo');
                if (unpaidRents.length > 0) {
                    if (currUnpaidRow) currUnpaidRow.style.display = '';
                    if (currUnpaidInfo) currUnpaidInfo.textContent = unpaidRents.length + 'ê±´';
                    if (currPaidRow) currPaidRow.style.display = 'none';
                } else if (rate >= 100 && totalThisMonth > 0) {
                    if (currUnpaidRow) currUnpaidRow.style.display = 'none';
                    if (currPaidRow) currPaidRow.style.display = '';
                    if (currPaidInfo) currPaidInfo.textContent = 'ì „ì²´ ì™„ë£Œ!';
                } else {
                    if (currUnpaidRow) currUnpaidRow.style.display = 'none';
                    if (currPaidRow) currPaidRow.style.display = 'none';
                }

                /* ì´ë²ˆë‹¬ ë¼ë²¨ */
                var currMonthLabel = document.getElementById('currMonthLabel');
                if (currMonthLabel) currMonthLabel.textContent = m + 'ì›” (ì´ë²ˆë‹¬)';

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘¢ ì§€ë‚œë‹¬ ë„ë„› (ì™¼ìª½) ê³„ì‚° ë° ì—…ë°ì´íŠ¸
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var pm = m - 1, py = y;
                if (pm < 1) { pm = 12; py -= 1; }
                var prevMonthStr = py + '-' + String(pm).padStart(2, '0');
                var pmm = String(pm).padStart(2, '0');
                var prevRents  = (appData.rents || []).filter(function(r) { return r.month === prevMonthStr; });
                var prevPaid   = prevRents.filter(function(r) { return r.status === 'paid'; });
                var prevPaidAmt = prevPaid.reduce(function(s, r) { return s + r.amount; }, 0);
                var prevExpected = (appData.tenants || [])
                    .reduce(function(sum, t) {
                        // ì§€ë‚œë‹¬(py-pm) ê¸°ì¤€ìœ¼ë¡œ í•´ë‹¹ ì„¸ìž…ìžê°€ í™œì„±ì´ì—ˆëŠ”ì§€ íŒë‹¨
                        // ê³„ì•½ ì‹œìž‘ì¼ â‰¤ ì§€ë‚œë‹¬ ë§ AND (ê³„ì•½ ì¢…ë£Œì¼ ì—†ê±°ë‚˜ â‰¥ ì§€ë‚œë‹¬ ì´ˆ)
                        var csStr = (t.contractStart || '').slice(0, 7); // YYYY-MM
                        var ceStr = (t.contractEnd   || '').slice(0, 7); // YYYY-MM
                        var prevMonthStr2 = py + '-' + pmm;
                        var wasActive = csStr && csStr <= prevMonthStr2 &&
                            (!ceStr || ceStr >= prevMonthStr2);
                        if (!wasActive) return sum;
                        if ((t.rentType || 'monthly') === 'annual') {
                            var renewMM2 = (t.contractStart || '').slice(5, 7);
                            return renewMM2 === pmm ? sum + (t.monthlyRent || 0) : sum;
                        }
                        return sum + (t.monthlyRent || 0) + (t.managementFee || 0);
                    }, 0);
                var prevRate = prevExpected > 0 ? Math.round(prevPaidAmt / prevExpected * 100) : 0;

                var prevDonutArc = document.getElementById('prevDonutArc');
                var prevDonutPct = document.getElementById('prevDonutPct');
                if (prevDonutArc) {
                    var prevOffset = circ - (Math.min(prevRate, 100) / 100) * circ;
                    prevDonutArc.setAttribute('stroke-dasharray', circ.toFixed(1));
                    prevDonutArc.setAttribute('stroke-dashoffset', prevOffset.toFixed(1));
                    prevDonutArc.setAttribute('stroke', prevRate >= 100 ? '#22C55E' : '#6366F1');
                }
                if (prevDonutPct) prevDonutPct.textContent = prevRate + '%';

                var prevMonthLabel = document.getElementById('prevMonthLabel');
                if (prevMonthLabel) prevMonthLabel.textContent = pm + 'ì›” (ì§€ë‚œë‹¬)';

                var prevMonthIncome = document.getElementById('prevMonthIncome');
                var prevMonthExpected = document.getElementById('prevMonthExpected');
                if (prevMonthIncome)   prevMonthIncome.textContent   = prevPaidAmt.toLocaleString() + 'ì›';
                if (prevMonthExpected) prevMonthExpected.textContent = prevExpected > 0 ? prevExpected.toLocaleString() + 'ì›' : '-';

                /* ì§€ë‚œë‹¬ ë¯¸ë‚©/ì™„ë£Œ ë±ƒì§€ â€” ë…ë¦½ ìž¬ê³„ì‚° (scope ë¬¸ì œ ë°©ì§€) */
                var _pum = m - 1, _puy = y;
                if (_pum < 1) { _pum = 12; _puy -= 1; }
                var _puStr = _puy + '-' + String(_pum).padStart(2, '0');
                var _puAll = (appData.rents || []).filter(function(r) { return r.month === _puStr; });
                var _puUnpaid = _puAll.filter(function(r) { return (r.status === 'pending' || r.status === 'overdue') && (!r.type || r.type === 'monthly'); });
                var _puPaid   = _puAll.filter(function(r) { return r.status === 'paid'; });
                var prevUnpaidRow  = document.getElementById('prevUnpaidRow');
                var prevUnpaidInfo = document.getElementById('prevUnpaidInfo');
                var prevPaidRow    = document.getElementById('prevPaidRow');
                if (_puUnpaid.length > 0) {
                    if (prevUnpaidRow)  { prevUnpaidRow.style.display = 'flex'; }
                    if (prevUnpaidInfo) { prevUnpaidInfo.textContent = _puUnpaid.length + 'ê±´'; }
                    if (prevPaidRow)    { prevPaidRow.style.display = 'none'; }
                } else if (_puPaid.length > 0 && _puUnpaid.length === 0) {
                    if (prevUnpaidRow) { prevUnpaidRow.style.display = 'none'; }
                    if (prevPaidRow)   { prevPaidRow.style.display = 'flex'; }
                } else {
                    if (prevUnpaidRow) { prevUnpaidRow.style.display = 'none'; }
                    if (prevPaidRow)   { prevPaidRow.style.display = 'none'; }
                }

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘£ ë¯¸ë‚© í˜„í™© ë©€í‹°ì›” ì¹© (ìµœê·¼ 4ê°œì›” + ì´ë²ˆë‹¬)
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var histRow = document.getElementById('unpaidHistoryRow');
                var historyUnpaidTotal = 0;
                if (histRow) {
                    var chips = [];
                    // ìµœê·¼ 4ê°œì›”ì¹˜ ìƒì„± (ì´ë²ˆë‹¬ í¬í•¨ 4ê°œì›”)
                    for (var mi = 3; mi >= 0; mi--) {
                        var hm = m - mi, hy = y;
                        while (hm < 1) { hm += 12; hy -= 1; }
                        var hStr = hy + '-' + String(hm).padStart(2, '0');
                        var hRents = (appData.rents || []).filter(function(r) { return r.month === hStr; });
                        var hPaid  = hRents.filter(function(r) { return r.status === 'paid'; }).length;
                        var hUnpaidRents = hRents.filter(function(r) {
                            if (!((r.status === 'pending' || r.status === 'overdue') && (!r.type || r.type === 'monthly'))) return false;
                            var t = (appData.tenants || []).find(function(t) { return t.id === r.tenantId; });
                            var tEnd = t ? (t.contractEnd || '').slice(0, 7) : '';
                            return !tEnd || hStr <= tEnd; // ê³„ì•½ì¢…ë£Œ ì´í›„ ì›”ì€ ë¯¸ë‚©ìœ¼ë¡œ í‘œì‹œ ì•ˆ í•¨
                        });
                        var hUnpaid = hUnpaidRents.length;
                        historyUnpaidTotal += hUnpaid;
                        var hTotal = hRents.length;
                        var isCurr = (mi === 0);

                        var chipClass, statusText;
                        if (hTotal === 0) {
                            chipClass = 'chip-current';
                            statusText = 'ê¸°ë¡ì—†ìŒ';
                        } else if (isCurr) {
                            chipClass = hUnpaid > 0 ? 'chip-has-unpaid' : 'chip-all-paid';
                            statusText = hPaid + '/' + hTotal + ' ì™„ë£Œ' + (hUnpaid > 0 ? '<br>ë¯¸ë‚© ' + hUnpaid + 'ê±´' : '');
                        } else if (hUnpaid === 0 && hPaid > 0) {
                            chipClass = 'chip-all-paid';
                            statusText = 'ì „ì²´ ì™„ë£Œ';
                        } else if (hUnpaid > 0) {
                            chipClass = 'chip-has-unpaid';
                            statusText = 'ë¯¸ë‚© ' + hUnpaid + 'ê±´';
                        } else {
                            chipClass = 'chip-partial';
                            statusText = hPaid + '/' + hTotal;
                        }

                        var unpaidNamesHtml = hUnpaidRents.length > 0
                            ? '<span class="chip-unpaid-names">' + hUnpaidRents.map(function(r) {
                                var tenant = (appData.tenants || []).find(function(t) { return t.id === r.tenantId; });
                                return '<span class="chip-unpaid-name">' + escapeHTML(tenant && tenant.name ? tenant.name : 'ì„¸ìž…ìž ë¯¸ìƒ') + '</span>';
                            }).join('') + '</span>'
                            : '';
                        var chipIcon = hUnpaid === 0 && hPaid > 0
                            ? '<div class="chip-icon-circle chip-icon-ok">âœ“</div>'
                            : '';
                        chips.push(
                            '<div class="unpaid-chip ' + chipClass + '" role="button" tabindex="0" aria-label="' + hStr + ' ë¯¸ë‚© í˜„í™© ë³´ê¸°" onclick="showUnpaidDetail(\'' + hStr + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();showUnpaidDetail(\'' + hStr + '\');}">' +
                            '<span class="chip-month-label">' + hm + 'ì›”</span>' +
                            '<span class="chip-status-text">' + statusText + '</span>' +
                            unpaidNamesHtml +
                            chipIcon +
                            '</div>'
                        );
                    }
                    histRow.innerHTML = chips.join('');
                }
                var dashboardBadge = document.getElementById('dashboardBadge');
                var rentBadge = document.getElementById('rentBadge');
                [dashboardBadge, rentBadge].forEach(function(badge) {
                    if (!badge) return;
                    if (historyUnpaidTotal > 0) {
                        badge.textContent = historyUnpaidTotal;
                        badge.style.display = 'block';
                    } else {
                        badge.style.display = 'none';
                    }
                });

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘¤ ê³„ì•½ë§Œë£Œ ìž„ë°• ì¹´ë“œ (30ì¼ ì´ë‚´)
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var expirySection = document.getElementById('expirySection');
                var expiryListNew = document.getElementById('expiryListNew');
                var expiringList = (appData.tenants || []).filter(function(t) {
                    if (t.status !== 'active') return false;
                    var d = Math.floor((new Date(t.contractEnd) - today) / 86400000);
                    return d >= 0 && d <= 30;
                }).sort(function(a, b) {
                    return new Date(a.contractEnd) - new Date(b.contractEnd);
                });

                if (expirySection) {
                    if (expiringList.length > 0) {
                        expirySection.style.display = '';
                        if (expiryListNew) {
                            expiryListNew.innerHTML = expiringList.map(function(t) {
                                var d = Math.floor((new Date(t.contractEnd) - today) / 86400000);
                                var rm = (appData.rooms || []).find(function(r) { return r.id === t.roomId; });
                                var roomNo = rm ? rm.roomNumber + 'í˜¸' : '?í˜¸';
                                var endStr = (t.contractEnd || '').slice(0, 10).replace(/-/g, '.');
                                var urgency = d <= 14 ? 'ibadge-danger' : d <= 30 ? 'ibadge-warning' : 'ibadge-info';
                                var urgencyLabel = d <= 14 ? 'ê¸´ê¸‰' : d <= 30 ? 'ìž„ë°•' : 'ì˜ˆì •';
                                return '<div class="info-row" onclick="showTenantDetail(\'' + t.id + '\')" style="cursor:pointer;">' +
                                    '<div class="info-row-left">' +
                                    '<div class="info-row-room">' + roomNo + '</div>' +
                                    '<div class="info-row-name">' + t.name + '</div>' +
                                    '</div>' +
                                    '<div class="info-row-right">' +
                                    '<div class="info-row-date">' + endStr + '</div>' +
                                    '<div class="info-row-badge ' + urgency + '">' + d + 'ì¼ í›„ Â· ' + urgencyLabel + '</div>' +
                                    '</div>' +
                                    '<span style="color:#CBD5E1;font-size:20px;margin-left:6px;align-self:center;">â€º</span>' +
                                    '</div>';
                            }).join('');
                        }
                    } else {
                        expirySection.style.display = 'none';
                    }
                }

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘¥ ìˆ˜ë¦¬ ìš”ì²­ í˜„í™© ì¹´ë“œ
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var mainSectionNew = document.getElementById('maintenanceSectionNew');
                var mainListNew    = document.getElementById('maintenanceListNew');
                var mainRoomsNew = (appData.rooms || []).filter(function(r) { return r.status === 'maintenance'; });

                if (mainSectionNew) {
                    if (mainRoomsNew.length > 0) {
                        mainSectionNew.style.display = '';
                        if (mainListNew) {
                            mainListNew.innerHTML = mainRoomsNew.map(function(r) {
                                var b = (appData.buildings || []).find(function(bl) { return bl.id === r.buildingId; });
                                var bName = b ? b.name + ' ' : '';
                                var memo = r.maintMemo || r.memo || 'ìˆ˜ë¦¬ ë‚´ìš© ë¯¸ê¸°ìž¬';
                                var dateStr = r.maintStartDate ? ' Â· ' + r.maintStartDate.replace(/-/g, '.') : '';
                                var estStr = r.maintEstCost > 0 ? ' Â· ì˜ˆìƒ â‚©' + r.maintEstCost.toLocaleString() : '';
                                return '<div class="info-row">' +
                                    '<div class="info-row-left" onclick="openMaintenanceModal(\'' + r.id + '\')" style="cursor:pointer;">' +
                                    '<span class="info-row-room">' + bName + r.roomNumber + 'í˜¸</span>' +
                                    '<div class="info-row-desc">' + escapeHTML(memo) + dateStr + estStr + '</div>' +
                                    '</div>' +
                                    '<div class="info-row-right" style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">' +
                                    '<span class="info-row-badge ibadge-yellow">ðŸ”§ ìˆ˜ë¦¬ì¤‘</span>' +
                                    '<button onclick="openMaintenanceCompleteModal(\'' + r.id + '\')" style="font-size:11px;padding:3px 10px;background:#16A34A;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;">ì™„ë£Œ</button>' +
                                    '</div></div>';
                            }).join('');
                        }
                    } else {
                        mainSectionNew.style.display = 'none';
                    }
                }

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘¦ ë³´ì¦ê¸ˆ ë¯¸ë°˜í™˜ ì¹´ë“œ
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var todayStr = today.toISOString().split('T')[0];
                var depositPendingSection = document.getElementById('depositPendingSection');
                var depositPendingList    = document.getElementById('depositPendingList');
                var depositPendingTenants = (appData.tenants || []).filter(function(t) {
                    if (!t.deposit || t.deposit <= 0) return false;
                    if (t.depositRefunded) return false;
                    // ê³„ì•½ ì¢…ë£Œì¼ì´ ì˜¤ëŠ˜ ì´ì „ì¸ ì„¸ìž…ìžë§Œ
                    return t.contractEnd && t.contractEnd < todayStr;
                });
                if (depositPendingSection) {
                    if (depositPendingTenants.length > 0) {
                        depositPendingSection.style.display = '';
                        if (depositPendingList) {
                            depositPendingList.innerHTML = depositPendingTenants.map(function(t) {
                                var room = (appData.rooms || []).find(function(r) { return r.id === t.roomId; });
                                var b    = (appData.buildings || []).find(function(bl) { return bl.id === t.buildingId; });
                                var loc  = (b ? b.name + ' ' : '') + (room ? room.roomNumber + 'í˜¸ ' : '');
                                return '<div class="info-row" onclick="showTenantDetail(\'' + t.id + '\')" style="cursor:pointer;">' +
                                    '<div class="info-row-left">' +
                                    '<span class="info-row-room">' + t.name + '</span>' +
                                    '<div class="info-row-desc">' + loc + 'Â· â‚©' + (t.deposit || 0).toLocaleString() + '</div>' +
                                    '</div>' +
                                    '<div class="info-row-right">' +
                                    '<span class="info-row-badge ibadge-warning">ë¯¸ë°˜í™˜</span>' +
                                    '</div></div>';
                            }).join('');
                        }
                    } else {
                        depositPendingSection.style.display = 'none';
                    }
                }

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘§ ê³µì‹¤ í˜„í™© ì¹´ë“œ
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var vacantSectionNew = document.getElementById('vacantSectionNew');
                var vacantListNew    = document.getElementById('vacantListNew');
                var vacantRoomsNew   = (appData.rooms || []).filter(function(r) { return r.status === 'vacant'; });
                if (vacantSectionNew) {
                    if (vacantRoomsNew.length > 0) {
                        vacantSectionNew.style.display = '';
                        if (vacantListNew) {
                            vacantListNew.innerHTML = vacantRoomsNew.map(function(r) {
                                var b = (appData.buildings || []).find(function(bl) { return bl.id === r.buildingId; });
                                var bName = b ? b.name + ' ' : '';
                                return '<div class="info-row">' +
                                    '<div class="info-row-left">' +
                                    '<span class="info-row-room">' + bName + r.roomNumber + 'í˜¸</span>' +
                                    (r.memo ? '<div class="info-row-desc">' + r.memo + '</div>' : '') +
                                    '</div>' +
                                    '<div class="info-row-right">' +
                                    '<span class="info-row-badge ibadge-gray">ê³µì‹¤</span>' +
                                    '</div></div>';
                            }).join('');
                        }
                    } else {
                        vacantSectionNew.style.display = 'none';
                    }
                }

                /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                   â‘§ ì—°ê°„ ìš”ì•½ ì¹´ë“œ ì—…ë°ì´íŠ¸
                â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
                var yearPrefix = y + '-';
                var annualPaidAmt = (appData.rents || []).filter(function(r) {
                    return r.status === 'paid' && r.month && r.month.startsWith(yearPrefix);
                }).reduce(function(s, r) { return s + (r.amount || 0); }, 0);
                var annualExpenseAmt = (appData.expenses || []).filter(function(e) {
                    return e.date && e.date.startsWith(yearPrefix);
                }).reduce(function(s, e) { return s + (e.amount || 0); }, 0);
                var annualNet = annualPaidAmt - annualExpenseAmt;
                var totalRooms = (appData.rooms || []).length;
                var occupiedRooms = (appData.rooms || []).filter(function(r) { return r.status === 'occupied'; }).length;
                var occRate = totalRooms > 0 ? Math.round(occupiedRooms / totalRooms * 100) : 0;

                var annualTitleEl = document.getElementById('annualSummaryTitle');
                if (annualTitleEl) annualTitleEl.textContent = y + 'ë…„ ìš”ì•½';
                var annualIncomeEl = document.getElementById('annualIncome');
                var annualExpenseEl = document.getElementById('annualExpense');
                var annualProfitEl = document.getElementById('annualProfit');
                var annualOccEl = document.getElementById('annualOccupancy');
                function _fmtShort(n) {
                    if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + 'ì–µ';
                    if (n >= 10000000)  return (n / 10000000).toFixed(1).replace(/\.0$/, '') + 'ì²œë§Œ';
                    if (n >= 1000000)   return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'ë°±ë§Œ';
                    if (n >= 10000)     return (n / 10000).toFixed(1).replace(/\.0$/, '') + 'ë§Œ';
                    return n.toLocaleString();
                }
                if (annualIncomeEl)  annualIncomeEl.textContent  = 'â‚©' + _fmtShort(annualPaidAmt);
                if (annualExpenseEl) annualExpenseEl.textContent = 'â‚©' + _fmtShort(annualExpenseAmt);
                if (annualProfitEl) {
                    annualProfitEl.textContent = (annualNet >= 0 ? 'â‚©' : '-â‚©') + _fmtShort(Math.abs(annualNet));
                    annualProfitEl.className = 'annual-stat-val annual-profit' + (annualNet < 0 ? ' loss' : '');
                }
                if (annualOccEl) annualOccEl.innerHTML = occRate + '%<span style="display:block;font-size:10px;font-weight:600;color:#7C3AED;opacity:0.75;margin-top:1px;">' + occupiedRooms + '/' + totalRooms + 'ì‹¤</span>';

                /* â”€â”€ í•˜ìœ„í˜¸í™˜: subtitle, ë°°ì§€ ì—…ë°ì´íŠ¸ â”€â”€ */
                var sub = document.getElementById('dashSubtitleLine');
                if (sub) {
                    sub.textContent = historyUnpaidTotal > 0
                        ? 'âš ï¸ ë¯¸ë‚© ' + historyUnpaidTotal + 'ê±´ì´ ìžˆìŠµë‹ˆë‹¤'
                        : rate >= 100 ? 'âœ… ì´ë²ˆë‹¬ ìˆ˜ë‚© ì™„ë£Œ!' : m + 'ì›” ìˆ˜ë‚© í˜„í™©ìž…ë‹ˆë‹¤';
                }
                var mnEl = document.getElementById('dashMonthNum');
                var yrEl = document.getElementById('dashYearNum');
                if (mnEl) mnEl.textContent = m + 'ì›”';
                if (yrEl) yrEl.textContent = y + 'ë…„';
            };
        }

        /* â”€â”€ 4. initial call after DOM ready (in case DOMContentLoaded already fired) â”€â”€ */
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(function() {
                if (typeof renderDashboard === 'function') renderDashboard();
            }, 100);
        }
    })();



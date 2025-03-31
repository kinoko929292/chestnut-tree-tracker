// 木のデータ構造
const treesData = {
    1: {
        name: '木 1',
        customName: '',
        records: []
    },
    2: {
        name: '木 2',
        customName: '',
        records: []
    },
    3: {
        name: '木 3',
        customName: '',
        records: []
    },
    4: {
        name: '木 4',
        customName: '',
        records: []
    },
    5: {
        name: '木 5',
        customName: '',
        records: []
    }
};

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    // ローカルストレージからデータ読み込み
    loadData();
    
    // 木のクリックイベント設定
    document.querySelectorAll('.tree').forEach(tree => {
        tree.addEventListener('click', () => {
            const treeId = tree.getAttribute('data-tree-id');
            showTreeDetails(treeId);
        });
    });
});

// データ読み込み
function loadData() {
    const savedData = localStorage.getItem('chestnutTreesData');
    if (savedData) {
        Object.assign(treesData, JSON.parse(savedData));
    }
}

// 詳細ページ表示
function showTreeDetails(treeId) {
    window.location.href = `tree-detail.html?id=${treeId}`;
}

// 詳細ページ初期化
function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const treeId = urlParams.get('id');
    
    if (!treeId || !treesData[treeId]) {
        window.location.href = 'index.html';
        return;
    }

    // 木の情報を表示
    document.getElementById('tree-title').textContent = `栗の木 ${treeId} の成長記録`;
    document.getElementById('tree-name').textContent = treesData[treeId].name;
    
    // 戻るボタン設定
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // 記録一覧を表示
    renderRecords(treeId);

    // フォーム設定
    document.getElementById('record-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewRecord(treeId);
    });
}

// 記録一覧を表示
function renderRecords(treeId) {
    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '';

    if (treesData[treeId].records.length === 0) {
        recordsList.innerHTML = '<p>記録がありません</p>';
        return;
    }

    treesData[treeId].records.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.className = 'record-item';
        const recordIndex = treesData[treeId].records.indexOf(record);
        recordElement.innerHTML = `
            <div class="record-header">
                <h4>${record.date}</h4>
                <div class="record-actions">
                    <button class="edit-button" data-index="${recordIndex}">編集</button>
                    <button class="delete-button" data-index="${recordIndex}">削除</button>
                </div>
            </div>
            <p>${record.text}</p>
            ${record.fertilizer ? `<p><strong>施肥:</strong> ${record.fertilizer}</p>` : ''}
            ${record.photo ? `<img src="${record.photo}" class="record-photo" alt="成長記録写真">` : ''}
        `;

        // 編集・削除ボタンのイベント設定
        recordElement.querySelector('.edit-button').addEventListener('click', (e) => {
            e.stopPropagation();
            editRecord(treeId, parseInt(e.target.getAttribute('data-index')));
        });

        recordElement.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('この記録を削除しますか？')) {
                deleteRecord(treeId, parseInt(e.target.getAttribute('data-index')));
            }
        });
        recordsList.appendChild(recordElement);
    });
}

// 記録を削除
function deleteRecord(treeId, recordIndex) {
    treesData[treeId].records.splice(recordIndex, 1);
    saveData();
    renderRecords(treeId);
}

// 記録を編集
function editRecord(treeId, recordIndex) {
    const record = treesData[treeId].records[recordIndex];
    const form = document.getElementById('record-form');
    
    // フォームに既存の値を設定
    document.getElementById('record-date').value = record.date;
    document.getElementById('record-text').value = record.text;
    document.getElementById('record-fertilizer').value = record.fertilizer || '';
    
    // 送信ボタンのテキスト変更
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = '更新';
    
    // 既存のイベントリスナーを削除
    form.replaceWith(form.cloneNode(true));
    const newForm = document.getElementById('record-form');
    
    // 更新用のイベント設定
    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateRecord(treeId, recordIndex);
    });
}

// 記録を更新
function updateRecord(treeId, recordIndex) {
    const dateInput = document.getElementById('record-date');
    const textInput = document.getElementById('record-text');
    const fertilizerInput = document.getElementById('record-fertilizer');
    const photoInput = document.getElementById('record-photo');

    treesData[treeId].records[recordIndex] = {
        date: dateInput.value,
        text: textInput.value,
        fertilizer: fertilizerInput.value,
        photo: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) :
              treesData[treeId].records[recordIndex].photo // 既存の写真を保持
    };

    saveData();
    renderRecords(treeId);
    resetForm();
}

// フォームをリセット
function resetForm() {
    const form = document.getElementById('record-form');
    form.reset();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = '記録を追加';
    
    form.replaceWith(form.cloneNode(true));
    document.getElementById('record-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewRecord(getCurrentTreeId());
    });
}

// 現在表示中の木のIDを取得
function getCurrentTreeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 新しい記録を追加
function addNewRecord(treeId) {
    const dateInput = document.getElementById('record-date');
    const textInput = document.getElementById('record-text');
    const fertilizerInput = document.getElementById('record-fertilizer');
    const photoInput = document.getElementById('record-photo');

    const newRecord = {
        date: dateInput.value,
        text: textInput.value,
        fertilizer: fertilizerInput.value,
        photo: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : null
    };

    treesData[treeId].records.unshift(newRecord);
    saveData();
    renderRecords(treeId);

    // フォームをリセット
    dateInput.value = '';
    textInput.value = '';
    fertilizerInput.value = '';
    photoInput.value = '';
}

// ページ読み込み時に適切な初期化関数を呼び出す
if (window.location.pathname.includes('tree-detail.html')) {
    document.addEventListener('DOMContentLoaded', initDetailPage);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        loadData();
        document.querySelectorAll('.tree').forEach(tree => {
            tree.addEventListener('click', () => {
                const treeId = tree.getAttribute('data-tree-id');
                showTreeDetails(treeId);
            });
        });
    });
}

// 木の名前を更新
function updateTreeName(treeId) {
    const customName = document.getElementById('custom-name').value;
    treesData[treeId].customName = customName;
    saveData();
    renderTreeName(treeId);
}

// 木の名前を表示
function renderTreeName(treeId) {
    const displayName = treesData[treeId].customName || treesData[treeId].name;
    document.getElementById('tree-name').textContent = displayName;
}

// 詳細ページ初期化 (更新版)
function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const treeId = urlParams.get('id');
    
    if (!treeId || !treesData[treeId]) {
        window.location.href = 'index.html';
        return;
    }

    // 木の情報を表示
    document.getElementById('tree-title').textContent = `栗の木 ${treeId} の成長記録`;
    renderTreeName(treeId);
    
    // 名前フォーム設定
    document.getElementById('custom-name').value = treesData[treeId].customName;
    document.getElementById('name-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateTreeName(treeId);
    });

    // 戻るボタン設定
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // 記録一覧を表示
    renderRecords(treeId);

    // 記録フォーム設定
    document.getElementById('record-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewRecord(treeId);
    });
}

// データ保存
function saveData() {
    localStorage.setItem('chestnutTreesData', JSON.stringify(treesData));
}
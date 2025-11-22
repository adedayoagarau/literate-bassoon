// Novel Writer App - JavaScript

class NovelWriter {
    constructor() {
        this.chapters = [];
        this.currentChapterIndex = 0;
        this.autoSaveTimeout = null;
        
        this.initElements();
        this.loadFromStorage();
        this.attachEventListeners();
        this.loadCurrentChapter();
    }

    initElements() {
        this.editor = document.getElementById('editor');
        this.chapterTitle = document.getElementById('chapterTitle');
        this.chapterSelect = document.getElementById('chapterSelect');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.autoSaveStatus = document.getElementById('autoSaveStatus');
        this.newChapterBtn = document.getElementById('newChapterBtn');
        this.deleteChapterBtn = document.getElementById('deleteChapterBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('novelWriterData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.chapters = data.chapters || [];
            this.currentChapterIndex = data.currentChapterIndex || 0;
        }

        // Initialize with at least one chapter
        if (this.chapters.length === 0) {
            this.chapters.push({
                title: 'Chapter 1',
                content: ''
            });
        }
    }

    saveToStorage() {
        const data = {
            chapters: this.chapters,
            currentChapterIndex: this.currentChapterIndex
        };
        localStorage.setItem('novelWriterData', JSON.stringify(data));
        this.showAutoSaveStatus();
    }

    showAutoSaveStatus() {
        this.autoSaveStatus.textContent = 'Saved';
        this.autoSaveStatus.style.color = '#28a745';
        
        setTimeout(() => {
            this.autoSaveStatus.textContent = 'Auto-saved';
        }, 1000);
    }

    attachEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.updateStats();
            this.scheduleAutoSave();
        });

        this.chapterTitle.addEventListener('input', () => {
            this.scheduleAutoSave();
        });

        // Chapter management
        this.chapterSelect.addEventListener('change', (e) => {
            this.switchChapter(parseInt(e.target.value));
        });

        this.newChapterBtn.addEventListener('click', () => {
            this.createNewChapter();
        });

        this.deleteChapterBtn.addEventListener('click', () => {
            this.deleteCurrentChapter();
        });

        // Export and clear
        this.exportBtn.addEventListener('click', () => {
            this.exportNovel();
        });

        this.clearAllBtn.addEventListener('click', () => {
            this.clearAll();
        });
    }

    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveStatus.textContent = 'Saving...';
        this.autoSaveStatus.style.color = '#ffc107';
        
        this.autoSaveTimeout = setTimeout(() => {
            this.saveCurrentChapter();
        }, 1000);
    }

    saveCurrentChapter() {
        if (this.chapters[this.currentChapterIndex]) {
            this.chapters[this.currentChapterIndex].title = this.chapterTitle.value || `Chapter ${this.currentChapterIndex + 1}`;
            this.chapters[this.currentChapterIndex].content = this.editor.value;
            this.saveToStorage();
            this.updateChapterSelect();
        }
    }

    loadCurrentChapter() {
        const chapter = this.chapters[this.currentChapterIndex];
        if (chapter) {
            this.chapterTitle.value = chapter.title;
            this.editor.value = chapter.content;
            this.chapterSelect.value = this.currentChapterIndex;
            this.updateStats();
        }
    }

    switchChapter(index) {
        this.saveCurrentChapter();
        this.currentChapterIndex = index;
        this.loadCurrentChapter();
    }

    createNewChapter() {
        this.saveCurrentChapter();
        
        const newChapter = {
            title: `Chapter ${this.chapters.length + 1}`,
            content: ''
        };
        
        this.chapters.push(newChapter);
        this.currentChapterIndex = this.chapters.length - 1;
        
        this.updateChapterSelect();
        this.loadCurrentChapter();
        this.saveToStorage();
    }

    deleteCurrentChapter() {
        if (this.chapters.length <= 1) {
            alert('Cannot delete the last chapter. Your novel must have at least one chapter.');
            return;
        }

        if (confirm(`Are you sure you want to delete "${this.chapters[this.currentChapterIndex].title}"?`)) {
            this.chapters.splice(this.currentChapterIndex, 1);
            
            if (this.currentChapterIndex >= this.chapters.length) {
                this.currentChapterIndex = this.chapters.length - 1;
            }
            
            this.updateChapterSelect();
            this.loadCurrentChapter();
            this.saveToStorage();
        }
    }

    updateChapterSelect() {
        this.chapterSelect.innerHTML = '';
        this.chapters.forEach((chapter, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = chapter.title || `Chapter ${index + 1}`;
            this.chapterSelect.appendChild(option);
        });
        this.chapterSelect.value = this.currentChapterIndex;
    }

    updateStats() {
        const text = this.editor.value;
        const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        this.wordCount.textContent = `Words: ${words.toLocaleString()}`;
        this.charCount.textContent = `Characters: ${chars.toLocaleString()}`;
    }

    exportNovel() {
        this.saveCurrentChapter();
        
        let exportText = '# My Novel\n\n';
        
        this.chapters.forEach((chapter, index) => {
            exportText += `## ${chapter.title || `Chapter ${index + 1}`}\n\n`;
            exportText += chapter.content + '\n\n';
            exportText += '---\n\n';
        });

        // Calculate total stats
        const totalWords = this.chapters.reduce((sum, chapter) => {
            const words = chapter.content.trim().length > 0 ? chapter.content.trim().split(/\s+/).length : 0;
            return sum + words;
        }, 0);

        exportText += `\n\n**Total Word Count: ${totalWords.toLocaleString()} words**\n`;
        exportText += `**Total Chapters: ${this.chapters.length}**\n`;

        // Create and download file
        const blob = new Blob([exportText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-novel.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Novel exported successfully!');
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all chapters? This cannot be undone!')) {
            if (confirm('This will delete ALL your work. Are you absolutely sure?')) {
                localStorage.removeItem('novelWriterData');
                this.chapters = [{
                    title: 'Chapter 1',
                    content: ''
                }];
                this.currentChapterIndex = 0;
                this.updateChapterSelect();
                this.loadCurrentChapter();
                alert('All data has been cleared.');
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NovelWriter();
});

document.addEventListener('DOMContentLoaded', function() {
    // Додаємо інформацію про репозиторій у консоль
    console.log('🎰 Гра "Однорукий бандит"');
    console.log('📁 GitHub репозиторій: https://github.com/your-username/slot-machine-game');
    console.log('👨‍💻 Автор: Ваше Ім\'я');
    console.log('📅 Дата створення: ' + new Date().toLocaleDateString());

    // Запит імені гравця
    let playerName = '';
    while (!playerName || playerName.trim() === '') {
        playerName = prompt("Введіть ваше ім'я:", "");
        if (playerName === null) {
            playerName = "Гравець";
            break;
        }
    }
    document.getElementById('player-name').textContent = playerName.trim() || "Гравець";

    // Символи для гри
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '🔔', '💎', '🍀'];
    
    // Елементи гри
    const reels = [
        document.getElementById('reel-content1'),
        document.getElementById('reel-content2'),
        document.getElementById('reel-content3')
    ];
    const spinBtn = document.getElementById('spin-btn');
    const roundElement = document.getElementById('round');
    const winsElement = document.getElementById('wins');
    const resultElement = document.getElementById('result');
    
    // Стан гри
    let currentRound = 1;
    let wins = 0;
    let isSpinning = false;
    
    // Ініціалізація барабанів
    function initializeReels() {
        reels.forEach(reel => {
            reel.innerHTML = '';
            // Створюємо 5 символів для кожного барабана
            for (let i = 0; i < 5; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                // Випадковий символ, але гарантуємо, що по вертикалі не повторюються
                let randomSymbol;
                do {
                    randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                } while (i > 0 && reel.children[i-1].textContent === randomSymbol);
                
                symbol.textContent = randomSymbol;
                reel.appendChild(symbol);
            }
            // Початкове положення
            reel.style.transform = 'translateY(0)';
        });
    }
    
    // Обертання барабанів
    function spinReels() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        resultElement.textContent = '';
        resultElement.className = 'result';
        
        // Випадкові позиції для зупинки
        const stopPositions = [
            Math.floor(Math.random() * 5),
            Math.floor(Math.random() * 5),
            Math.floor(Math.random() * 5)
        ];
        
        // Анімація обертання для кожного барабана
        reels.forEach((reel, index) => {
            // Випадкова кількість додаткових обертів
            const extraSpins = 3 + Math.floor(Math.random() * 2);
            const finalPosition = -stopPositions[index] * 150;
            const totalSpin = -(5 * 150 * extraSpins) + finalPosition;
            
            reel.style.transition = 'transform 3s cubic-bezier(0.1, 0.4, 0.2, 1)';
            reel.style.transform = `translateY(${totalSpin}px)`;
        });
        
        // Перевірка результату після завершення обертання
        setTimeout(() => {
            checkResult(stopPositions);
            isSpinning = false;
            spinBtn.disabled = false;
        }, 3500);
    }
    
    // Перевірка результату
    function checkResult(positions) {
        // Отримуємо символи в центральній лінії
        const centerSymbols = positions.map((pos, index) => {
            const symbols = reels[index].getElementsByClassName('symbol');
            return symbols[2].textContent; // Центральний символ
        });
        
        // Перевіряємо, чи всі символи однакові
        const allSame = centerSymbols.every(symbol => symbol === centerSymbols[0]);
        
        if (allSame) {
            wins++;
            winsElement.textContent = wins;
            resultElement.textContent = `Вітаємо! Ви виграли в раунді ${currentRound}!`;
            resultElement.className = 'result win';
        } else {
            resultElement.textContent = `Спробуйте ще раз!`;
            resultElement.className = 'result lose';
        }
        
        // Перехід до наступного раунду або завершення гри
        currentRound++;
        roundElement.textContent = currentRound;
        
        if (currentRound > 3) {
            endGame();
        } else {
            // Підготовка до наступного раунду
            setTimeout(() => {
                initializeReels();
            }, 2000);
        }
    }
    
    // Завершення гри
    function endGame() {
        spinBtn.disabled = true;
        
        if (wins > 0) {
            resultElement.textContent = `Гра завершена! Ви перемогли в ${wins} з 3 раундів!`;
            resultElement.className = 'result win';
        } else {
            resultElement.textContent = `Гра завершена! На жаль, ви не перемогли жодного раунду.`;
            resultElement.className = 'result lose';
        }
        
        // Кнопка для початку нової гри
        setTimeout(() => {
            const newGameBtn = document.createElement('button');
            newGameBtn.textContent = 'Нова гра';
            newGameBtn.onclick = startNewGame;
            document.querySelector('.controls').appendChild(newGameBtn);
        }, 2000);
    }
    
    // Початок нової гри
    function startNewGame() {
        currentRound = 1;
        wins = 0;
        roundElement.textContent = currentRound;
        winsElement.textContent = wins;
        resultElement.textContent = '';
        resultElement.className = 'result';
        
        // Видаляємо кнопку нової гри
        const newGameBtn = document.querySelector('.controls button:last-child');
        if (newGameBtn && newGameBtn.textContent === 'Нова гра') {
            newGameBtn.remove();
        }
        
        spinBtn.disabled = false;
        initializeReels();
    }
    
    // Обробник події для кнопки
    spinBtn.addEventListener('click', spinReels);
    
    // Ініціалізація гри
    initializeReels();
});
document.addEventListener('DOMContentLoaded', () => {
    const netIncomeInput = document.getElementById('net-income');
    const workHoursDisplay = document.getElementById('work-hours-display');
    const itemPriceInput = document.getElementById('item-price');

    const getWorkingHoursForCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let workHours = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Monday to Friday
                workHours += 8;
            }
        }
        return workHours;
    };

    const monthlyWorkHours = getWorkingHoursForCurrentMonth();

    // Set current month name in Romanian
    const monthNames = [
        "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];
    const currentMonth = monthNames[new Date().getMonth()];

    const workHoursLabel = document.querySelector('label[for="work-hours-display"]') ||
        document.evaluate("//label[contains(text(), 'Ore Lucrate')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (workHoursLabel) {
        workHoursLabel.textContent = `Ore Lucrate în luna (${currentMonth})`;
    }

    workHoursDisplay.textContent = monthlyWorkHours;

    const resultsContainer = document.getElementById('results');
    const timeDisplay = document.getElementById('time-display');
    const hourlyWageDisplay = document.getElementById('hourly-wage');
    const progressBar = document.getElementById('progress-bar');
    const insightText = document.getElementById('insight-text');

    const calculate = () => {
        const income = parseFloat(netIncomeInput.value);
        const price = parseFloat(itemPriceInput.value);

        if (income > 0 && price >= 0) {
            resultsContainer.classList.remove('hidden');

            // Salariu pe oră
            const hourlyWage = income / monthlyWorkHours;
            hourlyWageDisplay.textContent = `Ron ${hourlyWage.toFixed(2)} / oră`;

            // Timp necesar
            const totalHoursNeeded = price / hourlyWage;

            // Calcul bazat pe o zi de lucru de 8 ore
            const days = Math.floor(totalHoursNeeded / 8);
            const remainingHours = Math.floor(totalHoursNeeded % 8);
            const minutes = Math.round((totalHoursNeeded % 1) * 60);

            let timeStringArr = [];

            // Romanian pluralization helper
            const getPlural = (n, singular, plural, specialPlural) => {
                if (n === 1) return singular;
                if (n === 0 || (n % 100 >= 1 && n % 100 <= 19)) return plural;
                return specialPlural || plural;
            };

            if (days > 0) {
                const label = getPlural(days, 'Zi', 'Zile', 'de Zile');
                timeStringArr.push(`${days} ${label}`);
            }

            if (remainingHours > 0 || (days === 0 && minutes === 0)) {
                const label = getPlural(remainingHours, 'Oră', 'Ore', 'de Ore');
                timeStringArr.push(`${remainingHours} ${label}`);
            }

            if (days === 0 && minutes > 0) {
                const label = getPlural(minutes, 'Minut', 'Minute', 'de Minute');
                timeStringArr.push(`${minutes} ${label}`);
            }

            let badgeHtml = `<div class="time-badge">${timeStringArr.join(', ')}</div>`;

            // Adăugăm totalul de ore ca a doua insignă (badge)
            const hoursLabel = getPlural(Math.round(totalHoursNeeded), 'Oră', 'Ore', 'Ore');
            badgeHtml += `<div class="time-badge total">${totalHoursNeeded.toFixed(1)} ${hoursLabel}</div>`;

            timeDisplay.innerHTML = badgeHtml;

            // Bara de progres (relativ la venitul lunar)
            const percentageOfMonthly = (price / income) * 100;
            const barWidth = Math.min(percentageOfMonthly, 100);
            progressBar.style.width = `${barWidth}%`;

            // Text detalii
            if (percentageOfMonthly > 100) {
                insightText.textContent = `Costă de ${(percentageOfMonthly / 100).toFixed(1)} ori venitul tău lunar. Gândește-te bine!`;
                progressBar.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
            } else {
                insightText.textContent = `Va trebui să lucrezi ${percentageOfMonthly.toFixed(1)}% din lună pentru a-ți permite asta.`;
                progressBar.style.background = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
            }

        } else {
            resultsContainer.classList.add('hidden');
        }
    };

    [netIncomeInput, itemPriceInput].forEach(input => {
        input.addEventListener('input', calculate);
    });
});

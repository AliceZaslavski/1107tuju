const moodsData = {
    "Tänulik": "#ffffcc",
    "Üksildane": "#e6ffff",
    "Segaduses": "#ecc6d9",
    "Innustunud": "#ccffcc",
    "Ärev": "#f2ccff",
    "Rahulik": "#ffcccc",
    "Vihane": "#ff0000",
    "Kurb": "#ccf2ff",
    "Rõõmus": "#ffe6f9",
    "Mäh": "#ffcc99"
};

let selectedDate = null;
let userMoods = { ...moodsData };

document.addEventListener("DOMContentLoaded", function () {
    generateMoodButtons();
    renderCalendar();
    document.getElementById("add-mood").addEventListener("click", openMoodPopup);
    document.getElementById("confirm-add-mood").addEventListener("click", addNewMood);
    document.getElementById("cancel-add-mood").addEventListener("click", closeMoodPopup);
    document.getElementById("save-btn").addEventListener("click", saveMood);
});

// ✅ **Popup avamine Notionis ja brauseris**
function openMoodPopup() {
    document.getElementById("newMoodPopup").style.display = "block";
}

function closeMoodPopup() {
    document.getElementById("newMoodPopup").style.display = "none";
}

function addNewMood() {
    const newMoodName = document.getElementById('newMoodInput').value.trim();
    if (!newMoodName || userMoods[newMoodName]) return;

    const newMoodColor = document.getElementById('newMoodColor').value;
    userMoods[newMoodName] = newMoodColor;

    generateMoodButtons();
    closeMoodPopup();
}

function generateMoodButtons() {
    const container = document.getElementById('mood-buttons');
    container.innerHTML = "";

    Object.keys(userMoods).forEach(mood => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('mood-wrapper');

        const button = document.createElement('button');
        button.classList.add('mood-button');
        button.textContent = mood;
        button.style.backgroundColor = userMoods[mood];

        const select = document.createElement('select');
        for (let i = 0; i <= 100; i += 10) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}%`;
            select.appendChild(option);
        }

        const colorPicker = document.createElement('input');
        colorPicker.type = "color";
        colorPicker.value = userMoods[mood];

        colorPicker.addEventListener("input", () => {
            button.style.backgroundColor = colorPicker.value;
            userMoods[mood] = colorPicker.value;
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-mood');
        removeBtn.textContent = "❌";
        removeBtn.addEventListener("click", () => wrapper.remove());

        wrapper.appendChild(button);
        wrapper.appendChild(select);
        wrapper.appendChild(colorPicker);
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);
    });
}

function saveMood() {
    if (!selectedDate) {
        alert("Palun vali kuupäev kalendrist!");
        return;
    }

    const selectedMoods = [];
    document.querySelectorAll('.mood-wrapper').forEach(wrapper => {
        const mood = wrapper.querySelector('button').textContent;
        const percentage = wrapper.querySelector('select').value;
        const color = wrapper.querySelector('input').value;

        if (parseInt(percentage) > 0) {
            selectedMoods.push({ mood, percentage: parseInt(percentage), color });
        }
    });

    localStorage.setItem(selectedDate, JSON.stringify(selectedMoods));
    renderCalendar();
}

function renderCalendar() {
    const header = document.getElementById('calendar-header');
    const calendar = document.getElementById('calendar-container');
    header.innerHTML = '';
    calendar.innerHTML = '';

    for (let i = 0; i <= 31; i++) {
        const num = document.createElement('div');
        num.textContent = i === 0 ? "" : i;
        header.appendChild(num);
    }

    const months = ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];
    months.forEach((month, monthIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month-label');
        monthDiv.textContent = month;
        calendar.appendChild(monthDiv);

        for (let i = 1; i <= 31; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.dataset.date = `${i}/${monthIndex + 1}`;
            dayDiv.addEventListener("click", () => {
                selectedDate = dayDiv.dataset.date;
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');
            });

            const moods = JSON.parse(localStorage.getItem(dayDiv.dataset.date)) || [];
            if (moods.length > 0) {
                dayDiv.style.background = createGradientBackground(moods);
            }

            calendar.appendChild(dayDiv);
        }
    });
}

/**
 * 🎨 **Töötab 1-5 värvi gradientina vastavalt protsentidele!**
 */
function createGradientBackground(moods) {
    if (moods.length === 1 && moods[0].percentage === 100) {
        return moods[0].color;
    }

    moods.sort((a, b) => b.percentage - a.percentage);
    if (moods.length > 5) moods = moods.slice(0, 5);

    let gradientStops = [];
    let totalPercentage = 0;

    moods.forEach((mood) => {
        totalPercentage += mood.percentage;
        if (totalPercentage > 100) totalPercentage = 100;
        gradientStops.push(`${mood.color} ${totalPercentage}%`);
    });

    return `linear-gradient(to bottom right, ${gradientStops.join(', ')})`;
}

document.addEventListener("DOMContentLoaded", () => {
    generateMoodButtons();
    renderCalendar();
    document.getElementById('add-mood').addEventListener("click", openMoodPopup);
    document.getElementById('confirm-add-mood').addEventListener("click", addNewMood);
    document.getElementById('cancel-add-mood').addEventListener("click", closeMoodPopup);
    document.getElementById('save-btn').addEventListener("click", saveMood);
});

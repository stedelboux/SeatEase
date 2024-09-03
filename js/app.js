// Dados dos assentos usando 4 fileiras e 10 assentos por fileira
const rows = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('').slice(0, 4); // 4 fileiras
const seatsData = [];

// Preenche os dados dos assentos
rows.forEach(row => {
    for (let number = 1; number <= 10; number++) {
        seatsData.push({ id: `${row}${number}`, row, number, status: 'available' });
    }
});

// Função para marcar alguns assentos como reservados aleatoriamente
function markRandomReservedSeats() {
    const reservedCount = Math.floor(seatsData.length * 0.3); // 30% dos assentos são reservados
    const availableSeats = seatsData.filter(seat => seat.status === 'available');
    
    // Embaralha os assentos disponíveis e seleciona os reservados
    for (let i = 0; i < reservedCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        availableSeats[randomIndex].status = 'reserved';
        availableSeats.splice(randomIndex, 1); // Remove o assento da lista de disponíveis
    }
}

// Função para criar o mapa de assentos
function createSeatMap() {
    const seatMap = document.querySelector('.seat-map');
    seatMap.innerHTML = ''; // Limpa o conteúdo existente

    seatsData.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.className = `seat ${seat.status}`;
        seatElement.dataset.id = seat.id;
        seatElement.dataset.row = seat.row;
        seatElement.dataset.number = seat.number;
        seatElement.textContent = `${seat.row}${seat.number}`;
        seatElement.addEventListener('click', selectSeat);

        seatMap.appendChild(seatElement);
    });
}

// Função para selecionar assento
function selectSeat(event) {
    const seatElement = event.target;
    if (seatElement.classList.contains('reserved')) {
        return; // Não permite selecionar assentos reservados
    }

    // Alterna entre selecionado e não selecionado
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
    } else {
        seatElement.classList.add('selected');
    }

    updateReserveButton();
}

// Função para atualizar o botão de reserva
function updateReserveButton() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const reserveButton = document.getElementById('reserve-btn');
    reserveButton.classList.toggle('hidden', selectedSeats.length === 0);
}

// Função para reservar assentos e exibir nota fiscal
function reserveSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    if (selectedSeats.length === 0) return;

    selectedSeats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('reserved');
    });

    displayInvoice(selectedSeats);
    updateReserveButton();
}

// Função para exibir a nota fiscal
function displayInvoice(seats) {
    const invoiceSection = document.getElementById('invoice');
    const invoiceBody = document.getElementById('invoice-body');
    invoiceBody.innerHTML = ''; // Limpa o conteúdo existente

    seats.forEach(seat => {
        const row = seat.dataset.row;
        const number = seat.dataset.number;

        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `
            <td>${number}</td>
            <td>${row}</td>
        `;

        invoiceBody.appendChild(rowElement);
    });

    invoiceSection.classList.remove('hidden');
}

// Inicializa o mapa de assentos
markRandomReservedSeats();
createSeatMap();

// Adiciona evento de clique ao botão de reserva
document.getElementById('reserve-btn').addEventListener('click', reserveSeats);

const API_URL = 'http://localhost:3000/api/persons';

// Indlæs alle medlemmer når siden loader
document.addEventListener('DOMContentLoaded', () => {
    loadPersons();
    setupFormHandlers();
});

// Opsætning af formular event handlers
function setupFormHandlers() {
    // Tilføj nyt medlem
    document.getElementById('personForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createPerson();
    });

    // Rediger medlem
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updatePerson();
    });
}

// Hent og vis alle medlemmer
async function loadPersons() {
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '<p class="loading">Indlæser medlemmer...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Kunne ikke hente medlemmer');
        
        const persons = await response.json();
        
        if (persons.length === 0) {
            membersList.innerHTML = '<p class="loading">Ingen medlemmer fundet. Tilføj det første medlem!</p>';
            return;
        }

        membersList.innerHTML = '';
        persons.forEach(person => {
            const card = createMemberCard(person);
            membersList.appendChild(card);
        });
    } catch (error) {
        console.error('Fejl ved indlæsning af medlemmer:', error);
        membersList.innerHTML = `
            <div class="error-message">
                <strong>Fejl:</strong> Kunne ikke hente medlemmer. 
                Sørg for at serveren kører på http://localhost:3000
            </div>
        `;
    }
}

// Opret medlem-kort element
function createMemberCard(person) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
        <h3>${person.name}</h3>
        <div class="member-info">
            <p><strong>Parti:</strong> ${person.party}</p>
            <p><strong>Position:</strong> ${person.position}</p>
            ${person.post ? `<p><strong>Post:</strong> ${person.post}</p>` : ''}
        </div>
        <div class="member-actions">
            <button class="btn btn-edit" onclick="openEditModal('${person._id}')">Rediger</button>
            <button class="btn btn-delete" onclick="deletePerson('${person._id}')">Slet</button>
        </div>
    `;
    return card;
}

// Opret nyt medlem
async function createPerson() {
    const form = document.getElementById('personForm');
    const formData = new FormData(form);
    
    const personData = {
        name: formData.get('name'),
        party: formData.get('party'),
        position: formData.get('position'),
        post: formData.get('post') || undefined
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Kunne ikke oprette medlem');
        }

        showMessage('Medlem tilføjet succesfuldt!', 'success');
        form.reset();
        loadPersons();
    } catch (error) {
        console.error('Fejl ved oprettelse af medlem:', error);
        showMessage('Fejl: ' + error.message, 'error');
    }
}

// Åbn rediger modal
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Kunne ikke hente medlem');
        
        const person = await response.json();
        
        document.getElementById('editId').value = person._id;
        document.getElementById('editName').value = person.name;
        document.getElementById('editParty').value = person.party;
        document.getElementById('editPosition').value = person.position;
        document.getElementById('editPost').value = person.post || '';
        
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Fejl ved hentning af medlem:', error);
        showMessage('Fejl: ' + error.message, 'error');
    }
}

// Luk rediger modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Opdater medlem
async function updatePerson() {
    const id = document.getElementById('editId').value;
    const form = document.getElementById('editForm');
    const formData = new FormData(form);
    
    const personData = {
        name: formData.get('name'),
        party: formData.get('party'),
        position: formData.get('position'),
        post: formData.get('post') || undefined
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Kunne ikke opdatere medlem');
        }

        showMessage('Medlem opdateret succesfuldt!', 'success');
        closeEditModal();
        loadPersons();
    } catch (error) {
        console.error('Fejl ved opdatering af medlem:', error);
        showMessage('Fejl: ' + error.message, 'error');
    }
}

// Slet medlem
async function deletePerson(id) {
    if (!confirm('Er du sikker på, at du vil slette dette medlem?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Kunne ikke slette medlem');
        }

        showMessage('Medlem slettet succesfuldt!', 'success');
        loadPersons();
    } catch (error) {
        console.error('Fejl ved sletning af medlem:', error);
        showMessage('Fejl: ' + error.message, 'error');
    }
}

// Ryd formular
function clearForm() {
    document.getElementById('personForm').reset();
}

// Vis besked til brugeren
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    const container = document.querySelector('.form-section');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Luk modal ved klik udenfor
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}
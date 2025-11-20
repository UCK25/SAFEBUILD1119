/* ui.js - funciones UI simples */
export function renderLogsTable(rows) {
  const tbody = document.querySelector('#logsTable tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date(r.fecha).toLocaleString()}</td>
                    <td>${r.user_qr}</td>
                    <td>${r.motivo}</td>
                    <td>${r.casco? 'Sí':'No'}</td>
                    <td>${r.chaleco? 'Sí':'No'}</td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('dl-pdf').addEventListener('click', e => {
    var eventos = document.getElementById('div_eventos');
    var opt = {
        margin: 0.5,
        filename: 'Eventos.pdf',
        image: {type: 'jpeg', quality: 2},
        html2canvas: {scale: 5},
        pagebreak: { mode: 'avoid-all', before: '#page2el' },
        jsPDF: {unit: 'in', format: 'tabloid', orientation: 'portrait'}
    };

    html2pdf().set(opt).from(eventos).save();
});
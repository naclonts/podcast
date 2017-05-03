
window.addEventListener('load', function (e) {
    var menu = document.getElementById('menu');
    var open = document.getElementById('menu-open');
    var close = document.getElementById('menu-close');

    open.addEventListener('click', function (e) {
        menu.classList.add('is-active');
        document.body.classList.add('has-active-menu');
        open.classList.remove('is-active');
        close.classList.add('is-active');
        console.log('open');
    });
    close.addEventListener('click', function (e) {
        menu.classList.remove('is-active');
        document.body.classList.remove('has-active-menu');
        open.classList.add('is-active');
        close.classList.remove('is-active');
        console.log('close');
    });
});

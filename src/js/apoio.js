function pressedKey(e){
    let i = 0;
    if(e.keyCode === 13){
        e.preventDefault();
        console.log(e.target.getAttribute('tabindex'));
        i = parseInt((e.target.getAttribute('tabindex')));
        document.querySelector(`[tabindex="${i+1}"]`).focus();
    }
    
}
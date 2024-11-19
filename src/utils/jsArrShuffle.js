// Shuffle JavaScript Array Using Fisher-Yates Shuffle
export const shuffledArr = (arr)=>{
    let array = arr;
    for (let i = array.length - 1; i > 0; i--) { 
    
        // Generate random index 
        const j = Math.floor(Math.random() * (i + 1));
                      
        // Swap elements at indices i and j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
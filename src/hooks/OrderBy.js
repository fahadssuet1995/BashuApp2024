export const Ascending = (data) => {
    // sorting data in the array
    data.sort((a, b) => {
        let keyA = new Date(a.date), keyB = new Date(b.date)
        // Compare the 2 dates
        if (keyA < keyB) return 1
        if (keyA > keyB) return -1
        return 0
    })

    return data
}
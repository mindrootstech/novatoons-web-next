function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','),
        bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: "image/jpeg" })
}

// Url to base 64
const srcToBase64 = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        
        const reader = new FileReader()
        reader.onloadend = () => {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })).catch(() => { })

export default srcToBase64


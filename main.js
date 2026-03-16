const apiKey = '91lpBYEKiMvdt6mkFvvrJxC8as2sGQOp1DWoafFevmFZmGUDvnIlDg0I' // Pexels API kaliti
const perPage = 15
let currentPage = 1
let searchTerm = ''

const imageWrapper = document.querySelector('.images')
const loadMorebtn = document.querySelector('.load-more')
const searchBox = document.querySelector('#input_search')
const modalImageBox = document.querySelector('.modal_image_box')
const modalImageCont = document.querySelector('.modal_content_div')
const modalCloseBtn = document.querySelector('.modal_close_btn')

// Boshlang‘ich modalni yashiramiz
modalImageBox.style.display = 'none'

// ✅ Modal oynani yopish funksiyasi
const closeModal = () => {
	modalImageBox.style.display = 'none'
}

// ✅ Modal oynani ochish funksiyasi
const openMdal = (imgUrl, autor) => {
	modalImageBox.style = `
        display: flex;
        justify-content: center;
        align-items: center;
    `
	modalImageCont.innerHTML = `<div class='modal_sfsdfds'>
        <div class='modal_text'>
            <h1>${autor}</h1>
            <i onclick="closeModal()" class="fa-solid fa-x"></i>
        </div>
        <img src='${imgUrl}'/>
        <button class='modal_d_btn'>Yuklab olish</button>
    </div>`
}

// ✅ Modal ichidagi "Yuklab olish" tugmasini bosganda rasmni yuklash
modalImageBox.addEventListener('click', e => {
	if (e.target.classList.contains('modal_d_btn')) {
		const imgElement = modalImageCont.querySelector('img')
		if (imgElement) {
			downloadImage(imgElement.src)
		}
	}
})

// ✅ Rasm kartochkalarini yaratish funksiyasi
const generateHTML = images => {
	imageWrapper.innerHTML += images
		.map(
			img =>
				`<li class="card" onclick="openMdal('${img.src.large2x}', '${img.photographer}')">
                    <img src="${img.src.large2x}" alt="" class="preview-thumbnail">
                    <div class="details">
                        <div class="photographer">
                            <i class="uil uil-camera"></i>
                            <span>${img.photographer}</span>
                        </div>
                        <button class='down_btn' data-img="${img.src.large2x}">
                            <i class="uil uil-import"></i>
                        </button>
                    </div>
                </li>`
		)
		.join('')
}

// ✅ API orqali rasmlarni olish funksiyasi
const getImages = apiURL => {
	fetch(apiURL, { headers: { Authorization: apiKey } })
		.then(res => res.json())
		.then(data => {
			if (data.photos.length === 0) {
				alert('Hech narsa topilmadi!')
				return
			}
			generateHTML(data.photos)
		})
		.catch(err => console.error('Xatolik yuz berdi:', err))
}

// ✅ Rasmni yuklab olish funksiyasi
const downloadImage = imgUrl => {
	fetch(imgUrl)
		.then(res => res.blob())
		.then(blob => {
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'image.jpg'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		})
		.catch(() => alert('Rasmni yuklab bo‘lmadi!'))
}

// ✅ Tasodifiy sahifa raqami bilan rasmlar yuklash
const getRandomImages = () => {
	let randomPage = Math.floor(Math.random() * 100) + 1
	let apiURL = `https://api.pexels.com/v1/curated?page=${randomPage}&per_page=${perPage}`
	imageWrapper.innerHTML = ''
	getImages(apiURL)
}

// ✅ Sahifa yangilanganda random rasmlar yuklanadi
window.addEventListener('load', getRandomImages)

// ✅ Qidiruv funksiyasi
searchBox.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		currentPage = 1
		searchTerm = e.target.value.trim()

		if (!searchTerm) {
			alert('Iltimos, qidiruv so‘zini kiriting!')
			return
		}

		imageWrapper.innerHTML = ''
		let apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
		getImages(apiURL)
	}
})

// ✅ "Load More" tugmasi bosilganda
loadMorebtn.addEventListener('click', () => {
	currentPage++
	let apiURL = searchTerm
		? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
		: `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
	getImages(apiURL)
})

// ✅ Rasm yuklash tugmasi bosilganda yuklab olish
imageWrapper.addEventListener('click', e => {
	if (
		e.target.classList.contains('down_btn') ||
		e.target.closest('.down_btn')
	) {
		const imgUrl = e.target.closest('.down_btn').dataset.img
		if (imgUrl) {
			downloadImage(imgUrl)
		}
	}
})

// ✅ Modal oynani yopish tugmasi
modalCloseBtn.addEventListener('click', closeModal)

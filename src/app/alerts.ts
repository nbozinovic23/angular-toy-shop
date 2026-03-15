import Swal from "sweetalert2";

export const matCustomClass = {
    popup: 'mat-swal-popup',
    title: 'mat-swal-title',
    actions: 'mat-swal-actions',
    confirmButton: 'mat-swal-confirm',
    cancelButton: 'mat-swal-cancel'
}

export class Alerts {
    static success(text: string) {
        Swal.fire({
            title: 'Success',
            text,
            icon: 'success',
            customClass: matCustomClass
        })
    }

    static error(text: string) {
        Swal.fire({
            title: 'Error',
            text,
            icon: 'error',
            customClass: matCustomClass
        })
    }

    static async confirm(text: string, callback: Function) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            customClass: matCustomClass
        })

        if (result.isConfirmed) {
            await callback()
        }
    }

    static toyDetails(title: string, html: string) {
        Swal.fire({
            title,
            html,
            icon: 'info',
            confirmButtonText: 'Zatvori',
            customClass: matCustomClass
        })
    }

    static async editCartItem(toyName: string, currentQuantity: number, pricePerItem: number, callback: (quantity: number, totalPrice: number) => void) {
        const { value, isConfirmed } = await Swal.fire({
            title: `Izmeni količinu: ${toyName}`,
            html: `
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 500;">Količina:</label>
                    <input id="edit-quantity" type="number" min="1" value="${currentQuantity}"
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: 14px; box-sizing: border-box;">
                </div>
                <p id="edit-total" style="text-align: right; font-weight: 500;">Ukupno: ${currentQuantity * pricePerItem} RSD</p>
            `,
            showCancelButton: true,
            confirmButtonText: 'Sačuvaj',
            cancelButtonText: 'Otkaži',
            customClass: matCustomClass,
            didOpen: () => {
                const input = document.getElementById('edit-quantity') as HTMLInputElement
                const total = document.getElementById('edit-total') as HTMLParagraphElement
                input.addEventListener('input', () => {
                    const q = Math.max(1, Number(input.value) || 1)
                    total.textContent = `Ukupno: ${q * pricePerItem} RSD`
                })
            },
            preConfirm: () => {
                const quantity = Math.max(1, Number((document.getElementById('edit-quantity') as HTMLInputElement).value) || 1)
                if (quantity < 1) {
                    Swal.showValidationMessage('Količina mora biti najmanje 1!')
                    return false
                }
                return { quantity, totalPrice: quantity * pricePerItem }
            }
        })

        if (isConfirmed && value) {
            callback(value.quantity, value.totalPrice)
        }
    }

    static async rateItem(toyName: string, callback: (rating: number, comment: string) => void) {
        const { value, isConfirmed } = await Swal.fire({
            title: `Ocenite: ${toyName}`,
            html: `
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 500;">Ocena:</label>
                    <div id="star-container" style="display: flex; justify-content: center; gap: 8px; font-size: 32px; cursor: pointer;">
                        <span class="star" data-value="1">☆</span>
                        <span class="star" data-value="2">☆</span>
                        <span class="star" data-value="3">☆</span>
                        <span class="star" data-value="4">☆</span>
                        <span class="star" data-value="5">☆</span>
                    </div>
                    <input type="hidden" id="rating-value" value="0">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 500;">Komentar:</label>
                    <textarea id="review-comment" rows="3" placeholder="Napišite recenziju..." 
                        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: 14px; box-sizing: border-box;"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Potvrdi',
            cancelButtonText: 'Otkaži',
            customClass: matCustomClass,
            didOpen: () => {
                const stars = document.querySelectorAll('.star')
                const ratingInput = document.getElementById('rating-value') as HTMLInputElement

                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        const value = Number(star.getAttribute('data-value'))
                        ratingInput.value = String(value)
                        stars.forEach(s => {
                            s.textContent = Number(s.getAttribute('data-value')) <= value ? '★' : '☆'
                        })
                    })

                    star.addEventListener('mouseover', () => {
                        const value = Number(star.getAttribute('data-value'))
                        stars.forEach(s => {
                            s.textContent = Number(s.getAttribute('data-value')) <= value ? '★' : '☆'
                        })
                    })

                    star.addEventListener('mouseout', () => {
                        const current = Number((document.getElementById('rating-value') as HTMLInputElement).value)
                        stars.forEach(s => {
                            s.textContent = Number(s.getAttribute('data-value')) <= current ? '★' : '☆'
                        })
                    })
                })
            },
            preConfirm: () => {
                const rating = Number((document.getElementById('rating-value') as HTMLInputElement).value)
                const comment = (document.getElementById('review-comment') as HTMLTextAreaElement).value.trim()
                if (rating === 0) {
                    Swal.showValidationMessage('Morate odabrati ocenu!')
                    return false
                }
                if (comment === '') {
                    Swal.showValidationMessage('Morate uneti komentar!')
                    return false
                }
                return { rating, comment }
            }
        })

        if (isConfirmed && value) {
            callback(value.rating, value.comment)
        }
    }
}
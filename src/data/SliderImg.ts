const imagesSlider = [
    {
        imgName: '1',
        alt: 'imagen de about 1',
        type: ['webp'],
        get img(): string[] {
            return this.type.map((ty : string) =>{
                return `${this.imgName}.${ty}` ;
            })
        }
    },
    {
        imgName: '2',
        alt: 'imagen de about 2',
        type: ['avif'],
        get img(): string[] {
            return this.type.map((ty : string) =>{
                return `${this.imgName}.${ty}` ;
            })
        }
    },
    {
        imgName: '3',
        alt: 'imagen de banner',
        type: ['jpg'],
        get img(): string[] {
            return this.type.map((ty : string) =>{
                return `${this.imgName}.${ty}` ;
            })
        }
    },
    {
        imgName: '4',
        alt: 'imagen de cta',
        type: ['jpg'],
        get img(): string[] {
            return this.type.map((ty : string) =>{
                return `${this.imgName}.${ty}` ;
            })
        }
    }
] 


export default imagesSlider;
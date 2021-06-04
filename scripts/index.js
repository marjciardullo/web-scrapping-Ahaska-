const reqLouvre = () => {
   let returnList = [];
   const louvre = document.getElementById('louvre');
   fetch("https://cors-anywhere.herokuapp.com/https://collections.louvre.fr/en/recherche?typology%5B0%5D=1&author%5B0%5D=1151&location%5B0%5D=141080")
   .then(scrap => scrap.text())
   .then(pageScrap => {
      const pageDom = new DOMParser()
      const newPage = pageDom.parseFromString(pageScrap, 'text/html')   

      const scrapLouvre = (infos) => {
         infos.querySelectorAll('.card__link').forEach(item => {
            const src = item.querySelector('.lazyload').getAttribute('src');
            const name = item.querySelector('.card__title span').innerHTML;
            const date = item.querySelector('.card__date span').innerHTML.split('(')[0];

            returnList.push({src, name, date})
         })

         montaPagInicial(louvre, returnList)
      }

      scrapLouvre(newPage)
   })
   .catch(error => console.log(error))
}

//Rijks scrap--------------------------------
const reqRijks = () => {
   let returnList = [];
   const rij = document.getElementById('rij');
    fetch('https://cors-anywhere.herokuapp.com/https://www.rijksmuseum.nl/en/rijksstudio/works-of-art/biblical-scenes')
    .then(RijksScrap => RijksScrap.text())
    .then(firstPage => {
        let RijksDom = new DOMParser()
        let newRijks = RijksDom.parseFromString(firstPage, 'text/html')
        
        let scrapRijks = (info) => {
            info.querySelectorAll('figure.brick').forEach(item => {
                  const src = "https://" + item.querySelector('.lazy-image').getAttribute('data-src');
                  const name = item.querySelector('.link-reverse').innerHTML;
                  const date = item.querySelector('.text-subtle').innerHTML.split(',')[1];

                  returnList.push({src, name, date})
            })
            montaPagInicial(rij, returnList)
        }
        scrapRijks(newRijks)
    })
    .catch(error => console.log(error))
}

//Moma scrap--------------------------------
let reqMoma = () => {
   let returnList = [];
   const moma = document.getElementById('moma');
   fetch("https://cors-anywhere.herokuapp.com/https://www.moma.org/collection/?utf8=%E2%9C%93&q=&classifications=9&date_begin=1884&date_end=1909&with_images=1")
   .then(metPage => metPage.text())
   .then(pageText =>{
       let metDom = new DOMParser()
       let newPage = metDom.parseFromString(pageText, 'text/html')

       let rasparMoma = (infos) => {
            infos.querySelectorAll('.grid-item--work').forEach(item => {
               const picture = item.querySelector('.picture--start')
               const src = "https://moma.org" + picture.querySelector('.picture__img--static').getAttribute('src')
               const title = item.querySelector('.work--in-list__caption')

               const texts = title.querySelectorAll('.work--in-list__caption span')
               let date = "";
               let name = "";
               for(let i=0; i < texts.length; i++){
                   const artist = texts[0].innerHTML
                   name = texts[1].innerHTML
                   date = texts[2].innerHTML
               }
               returnList.push({src, name, date})
            })
            montaPagInicial(moma, returnList) 
         }
      rasparMoma(newPage)
   })

   .catch(error => console.log(error))
}


window.onload = function(){
   reqMoma()
   reqRijks()
   reqLouvre()
}

const montaPagInicial = (grid, infos) => {
   Array.from(grid.querySelectorAll('figure')).map((figure, i) => {
      const img = figure.querySelector('img');
      img.setAttribute('src',infos[i].src);

      figure.querySelector('p:first-child').innerHTML = infos[i].name;
      figure.querySelector('p:last-child').innerHTML = infos[i].date;
   })
}
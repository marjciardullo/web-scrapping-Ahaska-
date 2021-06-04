window.onload = function(){
   const id = location.search.split("=")[1];
   const h1 = document.getElementById("title");

   let returnParam = [];
   switch(id){
      case "moma":
         h1.innerHTML = "EXHIBITS AT MOMA";
         reqMoma(returnParam);
         break;
      case "louvre":
         h1.innerHTML = "EXHIBITS AT LOUVRE";
         reqLouvre(returnParam);
         break;
      case "rij": 
         h1.innerHTML = "EXHIBITS AT RIJKSMUSEUM";
         reqRijks(returnParam);
         break;
   }

   document.querySelector('#btn-search').addEventListener('click', function(){filtrar(returnParam)})
}

const filtrar = (infos) =>{
   document.querySelector('.masonry').innerHTML = "";
   const search =  document.getElementById('filter').value;
   infos.filter(i => i.name.match(search)).map(info => {
      montaMasonry(info)
   });
}

const reqLouvre = (param) => {
   fetch("https://cors-anywhere.herokuapp.com/https://collections.louvre.fr/en/recherche?typology%5B0%5D=1&author%5B0%5D=1151&location%5B0%5D=141080")
   .then(scrap => scrap.text())
   .then(pageScrap => {
      const pageDom = new DOMParser()
      const newPage = pageDom.parseFromString(pageScrap, 'text/html')   

      document.querySelector('.loading').style.display = "none";
      const scrapLouvre = (infos) => {
         infos.querySelectorAll('.card__link').forEach(item => {
            const src = item.querySelector('.lazyload').getAttribute('src');
            const name = item.querySelector('.card__title span').innerHTML;
            const date = item.querySelector('.card__date span').innerHTML.split('(')[0];
            const author = item.querySelector('.card__author span').innerHTML;

            param.push({src, name, date, author})
            montaMasonry({src, name, date, author})
         })

         //returnList.map(info => montaMasonry(info))
      }

      scrapLouvre(newPage)
   })
   .catch(error => console.log(error))
}

const reqRijks = (param) => {
    fetch('https://cors-anywhere.herokuapp.com/https://www.rijksmuseum.nl/en/rijksstudio/works-of-art/biblical-scenes')
    .then(RijksScrap => RijksScrap.text())
    .then(firstPage => {
        let RijksDom = new DOMParser()
        let newRijks = RijksDom.parseFromString(firstPage, 'text/html')
        
        document.querySelector('.loading').style.display = "none";
        let scrapRijks = (info) => {
            info.querySelectorAll('figure.brick').forEach(item => {
               const src = "https://" + item.querySelector('.lazy-image').getAttribute('data-src');
               const name = item.querySelector('.link-reverse').innerHTML;
               const date = item.querySelector('.text-subtle').innerHTML.split(',')[1];
               const author = item.querySelector('.text-subtle').innerHTML.split(',')[0];

               param.push({src, name, date, author})
               montaMasonry({src, name, date, author})
            })
        }
        scrapRijks(newRijks)
    })
    .catch(error => console.log(error))
}

let reqMoma = (param) => {
   fetch("https://cors-anywhere.herokuapp.com/https://www.moma.org/collection/?utf8=%E2%9C%93&q=&classifications=9&date_begin=1884&date_end=1909&with_images=1")
   .then(metPage => metPage.text())
   .then(pageText =>{
       let metDom = new DOMParser()
       let newPage = metDom.parseFromString(pageText, 'text/html')

       document.querySelector('.loading').style.display = "none";
       let rasparMoma = (infos) => {
            infos.querySelectorAll('.grid-item--work').forEach(item => {
               const picture = item.querySelector('.picture--start')
               const src = "https://moma.org" + picture.querySelector('.picture__img--static').getAttribute('src')
               const title = item.querySelector('.work--in-list__caption')

               const texts = title.querySelectorAll('.work--in-list__caption span')
               let date = "";
               let name = "";
               let author = "";
               for(let i=0; i < texts.length; i++){
                  author = texts[0].innerHTML
                  name = texts[1].innerHTML
                  date = texts[2].innerHTML
               }

               param.push({src, name, date, author})
               montaMasonry({src, name, date, author})
            })
         }
      rasparMoma(newPage)
   })
   .catch(error => console.log(error))
}

const montaMasonry = (info) => {
   figure = document.createElement('figure');
   figure.className="item";

   div = document.createElement('div');
   
   pnome = document.createElement('p');
   pnome.innerHTML = info.name;
   div.appendChild(pnome);

   pdate = document.createElement('p');
   pdate.innerHTML = info.date;
   div.appendChild(pdate);

   pauthor = document.createElement('p');
   pauthor.innerHTML = info.author;
   div.appendChild(pauthor);

   figure.appendChild(div)

   img = document.createElement('img');
   img.setAttribute('src',info.src);

   figure.appendChild(img)
   document.querySelector('.masonry').appendChild(figure)
}
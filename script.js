const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function getRating($,stats_info){
    var rating_inputs = stats_info.find('.stars-box > fieldset');
    var rating = null;
    $(rating_inputs).find("input").each((index,element) =>{

        if($(element).attr('checked')=="checked"){
            rating = $(element).attr('value');
            return false;
        }
    });
    return rating;

}

function scrapeProductsInfo($){
    let products = [];
    $('.cat-product').each((index, element) =>{
        const product = {   "card_length":null,
                            "card_length_unit":null,
                            "RAM":null,
                            "RAM_unit":null,
                            "chipset":null,
                            "clock_speed":null,
                            "clock_speed_unit":null,
                            "merging":null,
                            "rating_count":'0',
                            "questions_count":'0',
                            "purchases_count":'0',
                            "rating":null
                        
                        };
        // let card_specs = {  "card_length":null,
        //                     "card_length_unit":null,
        //                     "RAM":null,
        //                     "RAM_unit":null,
        //                     "chipset":null,
        //                     "clock_speed":null,
        //                     "clock_speed_unit":null,
        //                     "merging":null};
        // let card_stats = {"rating_count":'0',"questions_count":'0',"purchases_count":'0',"rating":'0.0'};

        let name = $(element).find('.cat-product-name__header').text().trim();
        let price = $(element).find('.cat-product-price').find('.price-new').text().trim()
        let cleanedPrice = price
                            .replace(/\s+(zł)$/,'')
                            .replace(/(\d)?\s+(\d)/,'$1$2')
                            .replace(/(\d),(\d)/g,'$1.$2');
        if(cleanedPrice == '') cleanedPrice = null;

        
        
        let card_info = $(element).find('.cat-product-features').find('.cat-product-feature');
        let stats_info = $(element).find('.cat-product-stat');

        // console.log(stats_info.text().trim());
        // console.log("_______________");
        const extractNumber = (str,nullCase) => {
            return /\d+/.test(str) ? str.replace(/^.*?(\d+).*$/, '$1') : nullCase;
        };

        for (let i=0;i<card_info.length;i++){
            let curCategory = $(card_info[i]).clone()
                                            .children('b')
                                            .remove()
                                            .end()
                                            .text()
                                            .trim();
            if (curCategory == 'Ilość pamięci RAM:') {

                const full_RAM = $(card_info[i]).find('b').text().trim();
                let RAM_size = extractNumber(full_RAM,null)
                if(RAM_size != null){
                    product.RAM = RAM_size;
                    product.RAM_unit = full_RAM.replace(/.*?(\w+)$/g,'$1');
                }
            } else if (curCategory == 'Długość karty:') {

                const full_card_length = $(card_info[i]).find('b').text().trim();
                let length = extractNumber(full_card_length,null)
                if(length != null){
                    product.card_length = length;
                    product.card_length_unit = full_card_length.replace(/.*?(\w+)$/g,'$1');
                }
                // console.log(card_specs.card_length,card_specs.card_length_unit);

            } else if (curCategory == 'Rodzaj chipsetu:') {
                product.chipset = $(card_info[i]).find('b').text().trim();
            } else if (curCategory == 'Taktowanie rdzenia w trybie boost:') {

                const full_clock_speed = $(card_info[i]).find('b').text().trim();
                let clock_speed_value = extractNumber(full_clock_speed, null);
                if (clock_speed_value != null) {
                    product.clock_speed = clock_speed_value;
                    product.clock_speed_unit = full_clock_speed.replace(/.*?(\w+)$/g, '$1');
                }

            } else if (curCategory == 'Łączenie kart:') {
                product.merging = $(card_info[i]).find('b').text().trim();
            } else {
                // Other categories ....
            }
           
        }
        // console.log(card_specs);


        product.rating_count = extractNumber(stats_info.find('.rating-count').text().trim(),'0') //.replace(/\((\d+)\)/g,'$1'); // assuming format (123)
        product.questions_count = extractNumber(stats_info.find('.cat-product-tech').text().trim(),'0');
        product.rating = getRating($,stats_info);
        
        product.purchases_count = extractNumber(stats_info.find('.cat-product-sold').text().trim(),'0') //.replace(/^.*?(\d+).*$/g,'$1');
        
        // console.log(rating_inputs);
        // console.log(card_stats);


        product.name = name;
        // product.spec = card_specs;
        // product.stats = card_stats;
        product.price = cleanedPrice;
        products.push(product);
    });
    return products
}
function getPageDetails($){
/**
 * Extracts page details in an object format as below
 * 
 * @param {object} $ - A jQuery-like object representing the web page's DOM.
 * @returns {{
 *      page_number: number,
 *      next_page_href: string
 * }}
 */
    const pageDetails = {};

    // Extract id of pagination on the webpage
    const pagination = $('#category_pagination');

    pageDetails.page_number = pagination.find(".active").text().trim() || null;

    const nextPageHref = pagination.find(".next").find("a").attr("href")|| null;
    pageDetails.next_page_href = nextPageHref ? nextPageHref : null;

    return pageDetails;
}

async function scrapeProducts(url){

    const products = [];
            
    // var [curPageProducts, pageInfo] = await scrapeData(url);
    // const full_url = "https://www.morele.net"+pageInfo.next_page_href;
    
    do{
        try {
            var [curPageProducts, pageInfo] = await scrapeData(url);
            // console.log(curPageProducts[1], pageInfo);
        } catch (error) {
            console.error("Błąd podczas scrapowania:", error);
        }
        
        var url = "https://www.morele.net"+pageInfo.next_page_href;
        
        products.push(...curPageProducts);
        console.log("Scraping page no. "+pageInfo.page_number+' ... \nNumber of already collected products: '+products.length);
    }while(pageInfo.next_page_href);

    return products;
}
async function scrapeData(url) {
    try {

        const { data } = await axios.get(url); 
        const $ = cheerio.load(data); 
        
        // const products = [];
        
        var curPageProducts = scrapeProductsInfo($);
        var curPageInfo = getPageDetails($);
        // products.push(...curPageProducts);
        // console.log(curPageProducts[0])

        return [curPageProducts, curPageInfo]; 

    } catch (error) {
        console.error('Błąd scrapowania:', error);
    }
    return [null,null]
}

const url_amazon = "https://www.amazon.pl/s?k=playstation+5";
const url_mediaexpert = "https://www.mediaexpert.pl/komputery-i-tablety/laptopy-i-ultrabooki/laptopy";
const url_xkom = "https://www.x-kom.pl/g-5/c/345-karty-graficzne.html";
const url_morele = "https://www.morele.net/kategoria/karty-graficzne-12/";
const url_morele_last = "https://www.morele.net/kategoria/karty-graficzne-12/,,,,,,,,0,,,,/10/";

// scrapeData("https://books.toscrape.com/");
// scrapeData(url_morele);
scrapeProducts(url_morele)
    .then(GPUs =>{
        fs.writeFileSync('data.json', JSON.stringify(GPUs, null, 2));
        console.log('Scraping done!');
    })
    .catch(error =>{
        console.log(error);
    });

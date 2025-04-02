const axios = require('axios');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');

const userAgent = new UserAgent();
const headers = {
    'User-Agent': userAgent.toString(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.5',
    'Host': 'www.x-kom.pl',
    'Connection': 'keep-alive'
}

function get_rating($,stats_info){
    var rating_inputs = stats_info.find('.stars-box > fieldset');
    var rating = '0.0';
    $(rating_inputs).find("input").each((index,element) =>{

        if($(element).attr('checked')=="checked"){
            rating = $(element).attr('value');
            return false;
        }
    });
    return rating;

}

async function scrapeData(url) {
    try {
        const { data } = await axios.get(url); // Pobieranie strony


        const $ = cheerio.load(data); // Wczytanie HTML-a do Cheerio
        
        const products = [];
        $('.cat-product').each((index, element) =>{
            const product = {};
            let card_specs = {"card_length":0,"RAM":0,"chipset":0,"clock_speed":0,"merging":false};
            let card_stats = {"rating_count":0,"questions_count":0,"purchases_count":0,"rating":0};
            let card_spec_keys = Object.keys(card_specs);
            let card_stats_keys = Object.keys(card_stats);


            let name = $(element).find('.cat-product-name__header').text().trim();
            let price = $(element).find('.cat-product-price').find('.price-new').text().trim()
            let cleanedPrice = price
                                .replace(/\s+(zł)$/,'')
                                .replace(/(\d)?\s+(\d)/,'$1$2')
                                .replace(/(\d),(\d)/g,'$1.$2');

            
            
            let card_info = $(element).find('.cat-product-features').find('.cat-product-feature');
            let stats_info = $(element).find('.cat-product-stat');

            // console.log(stats_info.text().trim());
            console.log("_______________");
            for (let i=0;i<card_spec_keys.length;i++){
                if(card_spec_keys[i]=="clock_speed"){
                    console.log($(card_info[i]).find('b').text().trim());
                    let clock = $(card_info[i]).find('b').text().trim().replace(/^.*?(\d+).*$/g,'$1');
                    // console.log(clock);

                    card_specs[card_spec_keys[i]] = clock;
                    continue;
                }
                card_specs[card_spec_keys[i]] = $(card_info[i]).find('b').text().trim();
                // console.log($(card_info[i]).find('b').text().trim());
            }

            card_stats.rating = get_rating($,stats_info);
            card_stats.rating_count = stats_info.find('.rating-count').text().trim().replace(/\((\d+)\)/g,'$1'); // assuming format (123)
            card_stats.questions_count = stats_info.find('.cat-product-tech').text().trim().replace(/^.*?(\d+).*$/g,'$1');
            if(card_stats.questions_count != "Zapytaj społeczności"){
                card_stats.rating = get_rating($,stats_info);
            }
            else card_stats.rating = 0;
            card_stats.purchases_count = stats_info.find('.cat-product-sold').text().trim().replace(/^.*?(\d+).*$/g,'$1');
            
            // console.log(rating_inputs);
            console.log(card_stats);


            product.name = name;
            product.spec = card_specs;
            product.price = cleanedPrice;
            products.push(product);
        });
        // console.log(products);

    } catch (error) {
        console.error('Błąd scrapowania:', error);
    }
}

const url_amazon = "https://www.amazon.pl/s?k=playstation+5";
const url_mediaexpert = "https://www.mediaexpert.pl/komputery-i-tablety/laptopy-i-ultrabooki/laptopy";
const url_xkom = "https://www.x-kom.pl/g-5/c/345-karty-graficzne.html";
const url_morele = "https://www.morele.net/kategoria/karty-graficzne-12/";

// scrapeData("https://books.toscrape.com/");
scrapeData(url_morele);

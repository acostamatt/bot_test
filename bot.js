const { Telegraf } = require('telegraf')
const axios = require("axios")
const ENV = require('./env')

const bot = new Telegraf(ENV.BOT_TOKEN)

const getLastUpdateDate = (date) => {
    const options = { weekday: 'long', day: 'numeric' }

    const newDate = new Date(date * 1000)
    const timeStr = newDate.toLocaleTimeString()
    const dateStr = newDate.toLocaleDateString('es-ES', options)
    const infoDateStr = "Actualizado: "+dateStr+', '+timeStr+' hs'
    return infoDateStr
}

const getDataAgrofy = async () => {
    try {
        const dictProducts = {}
        
        const url = 'https://api-cotizaciones.agrofy.com/api/BoardPrices/GetBoardPricesHome'
        const response = await axios(url)
        
        let fechaCarga = response.data[0]['FechaCarga'].split('-')
        fechaCarga = fechaCarga[0]+'/'+fechaCarga[1]
        
        response.data[0]['Productos'].forEach(element => {
            dictProducts[element['Producto']] = element['Mercados']
        })

        dictProducts['fechaCarga'] = fechaCarga
        return dictProducts
        
    } catch (error) {
        console.log(error)
    }
}

exports.startBot = async () => {
    try {
        
        const dictProducts = await getDataAgrofy()

        bot.hears('granos', ctx => {

            const infoDateStr = getLastUpdateDate(ctx.message.date)
            const emojiSoja = '\u{1F331}';
            const emojiTrigo = '\u{1F33E}';
            const emojiMaiz = '\u{1F33D}';
            const emojiGirasol = '\u{1F33B}';

            ctx.reply(
                infoDateStr+'\n\n'+

                emojiSoja+' Soja '+emojiSoja+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][0]['Nombre']+' - $'+dictProducts['Soja'][0]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][2]['Nombre']+' - $'+dictProducts['Soja'][2]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][3]['Nombre']+' - $'+dictProducts['Soja'][3]['Precio']+'\n\n'+

                emojiTrigo+' Trigo '+emojiTrigo+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Trigo'][0]['Nombre']+' - $'+dictProducts['Trigo'][0]['Precio']+'\n\n'+

                emojiMaiz+' Maiz '+emojiMaiz+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][0]['Nombre']+' - $'+dictProducts['Maiz'][0]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][2]['Nombre']+' - $'+dictProducts['Maiz'][2]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][3]['Nombre']+' - $'+dictProducts['Maiz'][3]['Precio']+'\n\n'+

                emojiGirasol+' Girasol '+emojiGirasol+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Girasol'][3]['Nombre']+' - $'+dictProducts['Girasol'][3]['Precio']

            )
        })
    
        
        bot.launch()
    } catch (error) {
        console.log(error)
    }
  
}
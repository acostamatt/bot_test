const { Telegraf } = require('telegraf')
const axios = require("axios")
const ENV = require('./env')

const bot = new Telegraf(ENV.BOT_TOKEN)

const getDateTimeLastUpdate = (date) => {
    let options = { weekday: 'long', day: 'numeric' }

    let newDate = new Date(date * 1000)
    let timeStr = newDate.toLocaleTimeString()
    let dateStr = newDate.toLocaleDateString('es-ES', options)
    let infoDateStr = "Actualizado: "+dateStr+', '+timeStr+' hs'
    return infoDateStr
}

exports.startBot = async () => {
    try {
        
        const url = 'https://api-cotizaciones.agrofy.com/api/BoardPrices/GetBoardPricesHome'
        const response = await axios(url)
        
        let dictProducts = {}
        let fechaCarga = response.data[0]['FechaCarga'].split('-')
        fechaCarga = fechaCarga[0]+'/'+fechaCarga[1]
        
        response.data[0]['Productos'].forEach(element => {
            dictProducts[element['Producto']] = element['Mercados']
        })

        dictProducts['fechaCarga'] = fechaCarga

        bot.hears('granos', ctx => {

            let infoDateStr = getDateTimeLastUpdate(ctx.message.date)
            let emojiSeedling = '\u{1F331}';
        
            ctx.reply(
                infoDateStr+'\n\n'+

                emojiSeedling+' Soja '+emojiSeedling+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][0]['Nombre']+' - $'+dictProducts['Soja'][0]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][2]['Nombre']+' - $'+dictProducts['Soja'][2]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Soja'][3]['Nombre']+' - $'+dictProducts['Soja'][3]['Precio']+'\n\n'+

                emojiSeedling+' Trigo '+emojiSeedling+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Trigo'][0]['Nombre']+' - $'+dictProducts['Trigo'][0]['Precio']+'\n\n'+

                emojiSeedling+' Maiz '+emojiSeedling+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][0]['Nombre']+' - $'+dictProducts['Maiz'][0]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][2]['Nombre']+' - $'+dictProducts['Maiz'][2]['Precio']+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Maiz'][3]['Nombre']+' - $'+dictProducts['Maiz'][3]['Precio']+'\n\n'+

                emojiSeedling+' Girasol '+emojiSeedling+'\n'+
                dictProducts['fechaCarga']+' - '+dictProducts['Girasol'][3]['Nombre']+' - $'+dictProducts['Girasol'][3]['Precio']

            )
        })
        
            
        bot.launch()
        
    } catch (error) {
        console.log(error)
    }
}


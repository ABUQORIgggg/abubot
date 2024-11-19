require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
// const path = require('path');  // Removed as it's no longer needed

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Function to display the main menu
const showMainMenu = async (chatId, messageId) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👤 About me', callback_data: 'about_me' }],
                [{ text: '📸 My Instagram', callback_data: 'instagram' }],
                [{ text: '📞 Contact me', callback_data: 'contact' }],
                [{ text: '🎵 My TikTok', callback_data: 'tiktok' }],
                [{ text: '📢 My Telegram Channel', callback_data: 'tg_channel' }]
            ]
        }
    };

    if (messageId) {
        // Edit the existing message to show the main menu
        await bot.editMessageText('Select using the buttons below:', {
            chat_id: chatId,
            message_id: messageId,
            ...options
        });
    } else {
        // Send the main menu if no messageId is provided
        bot.sendMessage(chatId, 'Select using the buttons below:', options);
    }
};

// /start command handler
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    showMainMenu(chatId);
});

// Callback query handler
bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const messageId = message.message_id;

    // Acknowledge the callback to remove the loading state
    bot.answerCallbackQuery(callbackQuery.id);

    switch (callbackQuery.data) {
        case 'about_me':
            // Send a text message instead of a photo and add a back button
            await bot.sendMessage(chatId, 'Hello! I am Abu F.D.X, a passionate developer and content creator. Welcome to my Telegram bot!', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Back', callback_data: 'back' }]
                    ]
                }
            });
            // Optionally, delete the previous menu message
            bot.deleteMessage(chatId, messageId);
            break;

        case 'instagram':
            // Edit the message to show Instagram info
            await bot.editMessageText('My Instagram: @abufdx, please follow!', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📸 Follow on Instagram', url: 'https://www.instagram.com/abufdx/' }],
                        [{ text: '🔙 Back', callback_data: 'back' }]
                    ]
                }
            });
            break;

        case 'contact':
            // Edit the message to show contact info
            await bot.editMessageText('My TG: @abufdx\nMy number: +998339462005', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Back', callback_data: 'back' }]
                    ]
                }
            });
            break;

        case 'tiktok':
            // Edit the message to show TikTok info
            await bot.editMessageText('My TikTok: @fx.abu, please follow!', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎵 Follow on TikTok', url: 'https://www.tiktok.com/@fx.abu' }],
                        [{ text: '🔙 Back', callback_data: 'back' }]
                    ]
                }
            });
            break;

        case 'tg_channel':
            // Edit the message to show Telegram channel info
            await bot.editMessageText('My Telegram Channel: [Subscribe here](https://t.me/abufdx00)', {
                parse_mode: 'Markdown',
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Back', callback_data: 'back' }]
                    ]
                }
            });
            break;

        case 'back':
            // Return to the main menu
            showMainMenu(chatId, messageId);
            break;

        default:
            bot.sendMessage(chatId, 'Unknown option selected.');
    }
});

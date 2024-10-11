import axios from 'axios';
import log from './utility/logger';
import { Request, Response } from 'express';

export const rateController = async (req: Request, res: Response) => {
    if (req.headers['x_coast_usdt_ngn_rate_token'] !== process.env.TOKEN) {
        return res.status(200).json({});
    }

    try {
        const response = await axios.post(
            `https://api2.bybit.com/fiat/otc/item/online`,
            {
                userId: '',
                tokenId: 'USDT',
                currencyId: 'NGN',
                payment: [
                    '14', // bank transfer payment
                ],
                side: '0', // sell (buy is "1")
                size: '200',
                page: '1',
                amount: '1490000',
                authMaker: true,
                canTrade: true,
                itemRegion: 2,
            },
            {
                timeout: 1000 * 4, // 4 secs timeout
                validateStatus: (status: number) => [1, 2, 3, 4, 5, 6].some(num => status.toString().startsWith(num.toString())),
            },
        );

        return res.status(200).json(response?.data);
    } catch (error) {
        // log.info(`Error in getting USDT-NGN rate from bybit`);
        log.info((error as any)?.response?.data || (error as any)?.data);
        log.info(JSON.stringify(error));
        return res.status(500).json({});
    }
};

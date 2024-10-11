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
                timeout: 1000 * 4.5, // 1 minutes timeout
                validateStatus: (status: number) => [200, 201, 400, 429, 204, 404, 403].includes(status),
            },
        );

        return res.status(200).json(response);
    } catch (error) {
        log.info(`Error in getting USDT-NGN rate from bybit`);
        log.info(JSON.stringify(error));
        log.info(error);
        return res.status(500).json({});
    }
};

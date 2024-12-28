import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.DB_CONNECT || '');

interface RequestData {
    userId: string;
    action: string;
}

interface User {
    userId: string; // 用户唯一标识
    username: string; // 用户名
    email: string; // 用户邮箱
    preferences: UserPreferences; // 用户偏好设置
    createdAt: Date; // 创建时间
    updatedAt: Date; // 更新时间
}

interface UserPreferences {
    theme: string; // 主题偏好
    language: string; // 语言偏好
    favoriteGenres: string[]; // 喜爱的诗词风格
}

interface PoetryFragment {
    fragmentId: string; // 诗词片段唯一标识
    content: string; // 诗词内容
    author: string; // 作者
    style: string; // 风格
    tags: string[]; // 标签
    createdAt: Date; // 创建时间
    updatedAt: Date; // 更新时间
}

interface Comment {
    commentId: string; // 评论唯一标识
    userId: string; // 评论用户ID
    poetryFragmentId: string; // 评论的诗词片段ID
    content: string; // 评论内容
    createdAt: Date; // 创建时间
}

interface Rating {
    ratingId: string; // 评分唯一标识
    userId: string; // 评分用户ID
    poetryFragmentId: string; // 评分的诗词片段ID
    score: number; // 评分分数
    createdAt: Date; // 创建时间
}

interface PoetryGenerationHistory {
    historyId: string; // 生成历史唯一标识
    userId: string; // 用户ID
    parameters: GenerationParameters; // 生成参数
    generatedPoem: string; // 生成的诗词
    createdAt: Date; // 创建时间
}

interface GenerationParameters {
    style: string; // 生成风格
    length: number; // 诗词长度
    keywords: string[]; // 关键词
    createdAt: Date; // 创建时间
}

const logUserRequest = async (requestData: RequestData) => {
    try {
        await mongoClient.connect();
        const database = mongoClient.db('apiproxy');
        const collection = database.collection('info');

        const result = await collection.insertOne({
            requestData,
            timestamp: new Date(),
        });

        console.log(`记录已插入，ID: ${result.insertedId}`);
    } catch (error) {
        console.error('插入记录失败:', error);
        throw new Error('插入记录失败，请稍后重试。');
    } finally {
        await mongoClient.close();
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        await logUserRequest(req.body);
        res.status(200).json({ message: '记录已插入' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
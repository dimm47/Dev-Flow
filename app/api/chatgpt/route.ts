import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a knowlegeable assistent that provides quality information.'
            },
            {
              role: 'user',
              content: `Tell me ${question}`
            }
          ]
        })
      }
    );

    const responseData = await response.json();
    let res: string;
    if (response.ok) {
      res = responseData.choices[0].message.content;
    } else {
      res = responseData.error.message;
    }
    const replay = res;
    return NextResponse.json({ replay });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};

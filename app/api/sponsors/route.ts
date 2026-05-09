import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';

interface AfdianSponsorItem {
  user: {
    user_id: string;
    name: string;
    avatar: string;
  }
}

interface AfdianApiResponse {
  ec: number;
  em: string;
  data: {
    total_page: number;
    list: AfdianSponsorItem[];
  };
}

interface Sponsor {
  url: string;
  name: string;
  avatar: string;
}

const manualSponsors: Sponsor[] = [
  {
    url: 'https://github.com/AidenNovak',
    name: 'AidenNovak',
    avatar: 'https://github.com/AidenNovak.png',
  },
];

function md5(message: string): string {
  return createHash('md5').update(message).digest('hex');
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const hostname = requestUrl.hostname;

  // Allow localhost for development
  if (
    !hostname.endsWith('.sylinko.com') &&
    !hostname.endsWith('sylinko.workers.dev') &&
    !hostname.includes('localhost') &&
    hostname !== '127.0.0.1'
  ) {
    return NextResponse.json(
      { error: 'Forbidden: Invalid Host' },
      { status: 403 }
    );
  }

  const USER_ID = process.env.AFDIAN_USER_ID;
  const API_TOKEN = process.env.AFDIAN_API_TOKEN;

  if (!USER_ID || !API_TOKEN) {
    // Return only manual sponsors if API credentials are not configured
    return NextResponse.json(
      {
        total_count: manualSponsors.length,
        data: {
          afdian: [],
          manual: manualSponsors,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=43200',
        },
      }
    );
  }

  let afdianSponsors: Sponsor[] = [];
  let currentPage = 1;
  let totalPage = 1;

  try {
    do {
      const paramsObj = { page: currentPage, per_page: 100 };
      const paramsJson = JSON.stringify(paramsObj);
      const ts = Math.floor(Date.now() / 1000).toString();

      const signText = `${API_TOKEN}params${paramsJson}ts${ts}user_id${USER_ID}`;
      const sign = md5(signText);

      const url = new URL('https://afdian.com/api/open/query-sponsor');
      url.searchParams.append('params', paramsJson);
      url.searchParams.append('ts', ts);
      url.searchParams.append('user_id', USER_ID);
      url.searchParams.append('sign', sign);

      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'Cloudflare Worker' },
      });
      const resData: AfdianApiResponse = await response.json();

      if (resData.ec !== 200) {
        throw new Error(`API Error: ${resData.em}`);
      }

      totalPage = resData.data.total_page;

      const pageList: Sponsor[] = resData.data.list.map((item) => ({
        url: `https://afdian.com/u/${item.user.user_id}`,
        name: item.user.name,
        avatar: item.user.avatar,
      }));

      afdianSponsors = afdianSponsors.concat(pageList);
      currentPage++;
    } while (currentPage <= totalPage);

    const finalResult = {
      total_count: afdianSponsors.length + manualSponsors.length,
      data: {
        afdian: afdianSponsors,
        manual: manualSponsors,
      },
    };

    return NextResponse.json(finalResult, {
      headers: {
        'Cache-Control': 'public, max-age=43200',
      },
    });
  } catch (error) {
    console.error('Sponsor API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

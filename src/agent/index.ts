import OpenAI from 'openai';
import { config } from '../config';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Tenor } from './Tenor';
import { Giphy } from './Giphy';
import readFile from '../content';

const { OPENAI_API_KEY } = config;

interface GetGifCompletionParams {
  context:
    | { role: 'user' | 'assistant'; content: string }[]
    | { role: 'user' | 'assistant'; content: string };
  maxTokens?: number;
  heuristic?: boolean;
  humanGeneratedQuery?: null | string;
}

class Agent {
  private client: OpenAI;
  private gifClient: Giphy;
  public shouldIncludeGif: boolean;

  constructor() {
    this.client = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.gifClient = new Giphy();
    this.shouldIncludeGif = this.calculateGifProbability();
  }

  private _getCurrentDatetime() {
    const now = new Date();
    const current_date = now.toLocaleDateString('es-AR', { dateStyle: 'full' });
    const current_time = now.toLocaleTimeString('es-AR', {
      timeStyle: 'medium',
    });
    return { current_date, current_time };
  }

  private calculateGifProbability(): boolean {
    return Math.random() < 0.33; // 33% de probabilidad
  }

  //MARK: getChatCompletion()
  public async getChatCompletion(
    history: { role: 'user' | 'assistant'; content: string }[],
    maxTokens: number = 500,
  ): Promise<any> {
    const { current_date, current_time } = this._getCurrentDatetime();

    const systemInfo = JSON.stringify({
      system_info: {
        current_date,
        current_time,
      },
      assistant_data: {
        name: 'Natalia',
        gender: 'Female',
      },
      role: 'AI Tutor',
      primary_function:
        'Support and guide incoming university students in their first year.',
      target_audience: {
        age_range: '18-25',
        departments: [
          'Astronomy',
          'Geophysics',
          'Physics',
          'Informatics',
          'Geology',
          'Biology',
        ],
      },
      files: [
        {
          file_name: 'general_knowledge',
          description:
            'This file provides an overview of the university system, focusing on the role and importance of universities in society, specifically the Universidad Nacional de San Juan (UNSJ). It covers the creation and history of the UNSJ and the Faculty of Exact, Physical, and Natural Sciences (FCEFyN), as well as the structure and organization of the UNSJ.',
          sections: [
            {
              title: 'What is the University?',
              description:
                "Defines the university as the highest educational institution responsible for training individuals in specialized fields of knowledge. It emphasizes the university's dual role in teaching and research and its contribution to societal development.",
            },
            {
              title: 'The Public University',
              description:
                'Focuses on the Universidad Nacional de San Juan as a public and free educational institution in Argentina. It discusses the responsibilities of students and the importance of societal contributions to maintain the university.',
            },
            {
              title: 'Creation of UNSJ and FCEFyN',
              description:
                'Details the historical background of the creation of the Universidad Nacional de San Juan and its faculties, with a particular focus on the Faculty of Exact, Physical, and Natural Sciences. It includes significant dates, figures, and milestones in the development of the university.',
            },
            {
              title: 'Structure of UNSJ and the Faculty',
              description:
                "Explains the political and academic organization of the UNSJ, highlighting the importance of democratic participation by students, faculty, and staff. It outlines the university's components, such as faculties, departments, and research institutes.",
            },
          ],
          key_terms: [
            'University',
            'Public Education',
            'UNSJ',
            'FCEFyN',
            'Higher Education',
            'Research and Teaching',
            'Faculty Structure',
            'Democratic Participation',
          ],
        },
        {
          file_name: 'Rights_and_Obligations_of_the_University_Student',
          description:
            'This file outlines the rights and obligations of university students, with a focus on their representation in the governance of the university. It explains the different roles students can take on at various levels, including the university, faculty, and specific degree programs.',
          sections: [
            {
              title: 'Student Representation',
              description:
                "Students are recognized as important members of the university's co-governance, with representation at various levels, from course delegates to members of the university's superior council.",
            },
            {
              title: 'Roles at the University Level',
              description:
                'Describes the roles students can have at the university level, including membership in the Federación Universitaria de San Juan and participation as a Superior Councilor (both titular and alternate).',
            },
            {
              title: 'Roles at the Faculty Level',
              description:
                'Covers the roles students can have within a specific faculty, such as being a member of the Student Center or serving as a Faculty Councilor (both titular and alternate).',
            },
            {
              title: 'Roles at the Degree Program Level',
              description:
                'Explains the roles students can take on within their specific degree programs, including course delegate, member of student associations like ASEGEO or ASEASTRO, and participation as a Departmental Councilor.',
            },
            {
              title: 'Student Associations',
              description:
                'Details the student associations within the faculty, such as ASEGEO (Geology) and ASEASTRO (Astronomy), and their roles in representing students, organizing events, and addressing academic and economic needs.',
            },
            {
              title: 'UNSJ SEG Student Chapter',
              description:
                'Describes the UNSJ SEG Student Chapter, formed by students of the Geophysics degree, aimed at promoting geosciences knowledge at national and international levels.',
            },
            {
              title: 'Faculty Council and Superior Council',
              description:
                'Explains the structure and roles of the Faculty Council and the Superior Council, including their responsibilities such as approving academic calendars, proposing the creation of new degree programs, and directing university policy.',
            },
            {
              title: 'Student Center',
              description:
                'Describes the role of the Student Center in each faculty, which represents the students and is governed by its own statute.',
            },
          ],
          key_terms: [
            'Student Representation',
            'Federación Universitaria de San Juan (FUSJ)',
            'Superior Council',
            'Faculty Council',
            'Student Center',
            'Course Delegate',
            'Student Associations',
            'ASEGEO',
            'ASEASTRO',
            'UNSJ SEG Student Chapter',
          ],
        },
        {
          file_name: 'university_well-being',
          description:
            'This file provides detailed information about the Secretaría de Bienestar Universitario at the Universidad Nacional de San Juan (UNSJ). It outlines the services and support available to students, including different types of scholarships, emergency aid, and dining options.',
          sections: [
            {
              title:
                'Importance of Knowing the Secretaría de Bienestar Universitario',
              description:
                'Highlights the importance of the Secretaría de Bienestar Universitario, where students can manage various administrative processes related to their well-being and academic support.',
            },
            {
              title: 'Scholarships and Financial Support',
              description:
                'Details the different types of scholarships offered by the Dirección de Servicio Social, which is part of the Secretaría de Bienestar Universitario. It explains the application requirements and process for these scholarships.',
            },
            {
              title: 'Types of Scholarships',
              description:
                'Lists the specific scholarships available to students, including transportation, economic aid (simple or double), residence, and photocopying support. Also mentions free meal options available at university dining halls.',
            },
            {
              title: 'Scholarship Requirements',
              description:
                'Outlines the requirements students must meet to qualify for scholarships, such as completing high school, having no outstanding subjects by March, maintaining a minimum GPA of 7, and passing the entrance course.',
            },
            {
              title: 'Emergency Scholarship',
              description:
                'Explains the process for obtaining an emergency scholarship in case of unexpected socio-economic difficulties during the academic year. This involves an interview with a social worker who evaluates the situation.',
            },
            {
              title: 'Contact Information for Dirección de Servicio Social',
              description:
                'Provides contact details for the Dirección de Servicio Social, including address, phone number, email, and office hours for students who need further assistance.',
            },
          ],
          key_terms: [
            'Bienestar Universitario',
            'Scholarships',
            'Financial Support',
            'Emergency Scholarship',
            'Dining Halls',
            'UNSJ',
            'Servicio Social',
            'Student Support',
          ],
        },
      ],
      response_preference: [
        'Always Answere in plain text without specifying any metadata nor any json format. Just response with the "message_content" value, using Discord formatting markdown where appropriate.',
        'Speak always in perfect fluid Spanish with an Argentinean accent, matching the style and tone of the conversation.',
        "When users mention 'Natalia' in the chat, understand that they're talking about you. Always recognize 'Natalia' as a reference to yourself and respond accordingly",
        "When interacting with users in Discord, use the <@user_id> tag only when directly addressing them in a conversation that requires their immediate attention or when referencing something they’ve specifically said. For general references or casual mentions, feel free to use just their user_name or a shortened form of it (e.g., 'KillerUp' can be shortened to 'Killer'). Strike a balance; avoid over-tagging, but don't shy away from tagging when it’s necessary for clarity.",
      ],
    });

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemInfo },
      ...history,
    ];

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'readFile',
            description:
              'Call this function every time a student ask for something related to the university life',
            parameters: {
              type: 'object',
              properties: {
                fileName: {
                  type: 'string',
                  description: 'The name of the file without the extension.',
                },
              },
              required: ['fileName'],
            },
          },
        },
      ],
      max_tokens: maxTokens,
    });

    this.shouldIncludeGif = this.calculateGifProbability();
    const message = response.choices[0].message;
    if (message?.tool_calls) {
      const call = message.tool_calls[0];

      if (call.type === 'function' && call.function.name === 'readFile') {
        const fileName: string = JSON.parse(call.function.arguments)[
          'fileName'
        ];

        const fileContent = readFile(fileName);

        const newResponse = await this.client.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: messages.concat([
            response.choices[0].message,
            { role: 'tool', tool_call_id: call.id, content: fileContent },
          ]),
          max_tokens: maxTokens,
        });

        const message = newResponse.choices[0].message;

        return message.content;
      }
    }

    return response.choices[0].message.content;
  }

  // MARK: getGIFCompletion()

  public async getGIFCompletion(
    params: GetGifCompletionParams,
  ): Promise<{ query: string; gifURL: string | null }> {
    const {
      context,
      maxTokens = 10,
      heuristic = true,
      humanGeneratedQuery = null,
    } = params;

    if (humanGeneratedQuery) {
      const gifURL = await this.gifClient.getExactGIF(humanGeneratedQuery);
      return { query: `${humanGeneratedQuery} GIF`, gifURL: gifURL || null };
    }

    const { current_date, current_time } = this._getCurrentDatetime();

    const systemInfo = JSON.stringify({
      system_info: {
        current_date,
        current_time,
      },
      assistant_data: {
        name: 'Natalia',
        gender: 'Female',
      },
      directives: [
        'You are a bot integrated in a Discord channel. Your task is to generate a single, concise search query for the Tenor API based on the context',
        'Your primary role is to generate only a single, concise search query in plain text without quotes format intended for the Tenor API, based on the context',
        'Leverage both popular and niche meme references to generate a search query that fits the ongoing discussion, without adding any extra text.',
        'Translate any colloquial expressions, emotional tones, or detailed descriptions provided by the users into relevant Tenor search queries.',
        'If specific scenes, characters, or images are referenced by users, incorporate those elements into your search query without adding any additional commentary.',
        'Always return only the search query relevant to the current conversation in plain text without quotes format, without any extra commentary or structure.',
        'Translate any references or emotions from the conversation into relevant Tenor search queries, considering both mainstream and niche memes.',
        'Ensure that the generated queries its always in English, regardless of the language used in the conversation.',
      ],
      example_queries: [
        {
          chat_context: "I'm feeling so tired after this long day.",
          generated_query: 'exhausted collapsing GIF',
        },
        {
          chat_context: 'That joke was absolutely hilarious!',
          generated_query: 'laughing uncontrollably GIF',
        },
        {
          chat_context: 'Can you believe they actually did that?',
          generated_query: 'shocked surprised disbelief GIF',
        },
        {
          chat_context: "I'm so excited about our trip next week!",
          generated_query: 'excited jumping for joy GIF',
        },
        {
          chat_context: 'This situation is really getting on my nerves.',
          generated_query: 'angry frustrated GIF',
        },
        {
          chat_context: 'Just got some amazing news!',
          generated_query: 'celebration happy dance GIF',
        },
        {
          chat_context: 'Ugh, why does this always happen to me?',
          generated_query: 'facepalm disappointed GIF',
        },
        {
          chat_context: "I'm ready to take on the world today!",
          generated_query: 'confident power walk GIF',
        },
        {
          chat_context: 'This is beyond ridiculous.',
          generated_query: 'sarcastic slow clap GIF',
        },
        {
          chat_context: 'I need a break from all this chaos.',
          generated_query: 'relaxing calm GIF',
        },
      ],
    });

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemInfo },
      ...(Array.isArray(context) ? context : [context]),
    ];

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: messages,
      max_tokens: maxTokens,
    });

    const aiGeneratedQuery = response.choices[0].message.content;

    // const gifURL = heuristic
    //   ? await this.tenorClient.getHeuristicGIF(aiGeneratedQuery)
    //   : await this.tenorClient.getExactGIF(aiGeneratedQuery);

    return {
      query: aiGeneratedQuery || 'El asistente no produjo ninguna query',
      gifURL: aiGeneratedQuery
        ? (await this.gifClient.getExactGIF(aiGeneratedQuery)) || null
        : null,
    };
  }
}

export default Agent;

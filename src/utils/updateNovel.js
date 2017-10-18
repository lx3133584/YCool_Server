import Bookshelf from '../models/bookshelf'
import Novel from '../models/novels'
import Rank from '../models/rank'
import Chapter from '../models/chapters'
import Schedule from 'node-schedule'
import * as Crawler from './crawler'

export function start() {
  var rule = new Schedule.RecurrenceRule();
  var times = [1, 9, 17];
  rule.hour = times;
  Schedule.scheduleJob(rule, function () {
    updateVip()
    updateRank()
  })
}

export async function updateVip() {
  let crawlerList,      //获取所有需要更新提醒的小说
      $,                //DOM
      length,           //章节数量
      chapterArr,       //所有a标签里包含的数组
      count,
      postfix,          //爬取网站的后缀
      title,            //章节名称
      chapter           //章节数据，用于存储
  try {
    //将需要爬取的小说类型设置成VIP
    crawlerList = await Novel.find({type: 'VIP'})
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  if (crawlerList) {
    for (let item of crawlerList.values()) {
      try {
        $ = await Crawler.getHtml(item.url)
      } catch (e) {
        Handle.sendEmail(e.message)
      }

      chapterArr = $('#list dd a')
      length = $('#list dd').length
      count = parseInt(item.countChapter)
      //如果爬取的章节列表数量不等于数据库中的数量，爬取余下章节
      if (count !== length) {
        for (let i = count; i < length; i++) {
          chapter = new Chapter({
            postfix: chapterArr[i].attribs.href,
            title: chapterArr[i].children[0].data,
            number: i + 1,
            novel: item.id
          })
          try {
            await chapter.save()
          } catch (e) {
            Handle.sendEmail(e.message)
          }
        }
        item.updateTime = $('#info p')[2].children[0].data.substring(5, $('#info p')[2].children[0].data.length)
        item.countChapter = length
        item.lastChapterTitle = chapterArr[length - 1].children[0].data
        try {
          await item.save()
        } catch (e) {
          Handle.sendEmail(e.message)
        }
        //发送邮件并更新小说信息
        sendEmail(item.name + '更新啦', 'update')
      }
    }
  }
}

async function getNovel(name, url) {

  let novel
  try {
    novel = await Novel.findOne({name})
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  //判断数据库中是否有该小说，没有在去网站爬取
  if (novel) return novel;
  
  try {
    var $ = await Crawler.getHtml(url)
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  let novelInfo = {}
  const author = $('#info p')[0].children[0].data
  const updateTime = $('#info p')[2].children[0].data
  const img = $('#fmimg img')[0].attribs['data-cfsrc']

  novelInfo.url = url
  novelInfo.name = $('#info h1')[0].children[0].data
  novelInfo.author = author.substring(27, author.length)
  novelInfo.img = `http://www.37zw.net${img}`
  novelInfo.updateTime = updateTime.substring(5, updateTime.length)
  novelInfo.introduction = $('#intro p')[0].children[0].data


  novel = new Novel(novelInfo)
  try {
    await novel.save()
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  const novelId = novel.id

  try {
    await Crawler.getNovel($, novelId)
    var lastChapter = await Chapter.getLastTitle(novelId)
    var count = await Chapter.getCount(novelId)
  } catch (e) {
    Handle.sendEmail(e.message)
  }

  novel.lastChapterTitle = lastChapter[0].title
  novel.countChapter = count

  try {
    await novel.save()
  } catch (e) {
    Handle.sendEmail(e.message)
  }
  return novel
}

export async function updateRank() {
  let $
  try {
    $ = await Crawler.getHtml('http://www.37zw.net/')
  } catch (e) {
    Handle.sendEmail(e.message)
  }
  const typeList = $('#main .novelslist .content')
  typeList.each(async function () {
    const _this = $(this)
    const type = _this.children('h2').text()

    _this.find('ul>li>a').each(async function (num) {
      const name = $(this).text()
      const url = $(this).attr('href')
      let novel
      try {
        novel = await getNovel(name, url)
      } catch (e) {
        Handle.sendEmail(e.message)
      }
      if (!novel) return

      let rank
      try {
        rank = await Rank.findOne({key: type + num})
      } catch (e) {
        Handle.sendEmail(e.message)
      }

      if (rank) {
        rank.novel = novel.id
      } else {
        rank = new Rank({
          type,
          novel: novel.id,
          num,
        })
      }

      try {
        await rank.save()
      } catch (e) {
        Handle.sendEmail(e.message)
      }

    })

  })

}

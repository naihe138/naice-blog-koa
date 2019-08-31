!(function(e) {
  var t = {};
  function r(s) {
    if (t[s]) return t[s].exports;
    var a = (t[s] = { i: s, l: !1, exports: {} });
    return e[s].call(a.exports, a, a.exports, r), (a.l = !0), a.exports;
  }
  (r.m = e),
    (r.c = t),
    (r.d = function(e, t, s) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s });
    }),
    (r.r = function(e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (r.t = function(e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var s = Object.create(null);
      if (
        (r.r(s),
        Object.defineProperty(s, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var a in e)
          r.d(
            s,
            a,
            function(t) {
              return e[t];
            }.bind(null, a)
          );
      return s;
    }),
    (r.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return r.d(t, "a", t), t;
    }),
    (r.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ""),
    r((r.s = 7));
})([
  function(e, t, r) {
    "use strict";
    e.exports = {
      MONGODB: {
        uri: "mongodb://127.0.0.1:27017/blogapi",
        prouri: "mongodb://xxxxx@xxxxx/blogapi"
      },
      QINIU: {
        accessKey: "your_qn_accessKey",
        secretKey: "your_qn_secretKey",
        bucket: "naice",
        origin: "xxxxxx",
        uploadURL: "your_qn_uploadURL"
      },
      User: {
        jwtTokenSecret: "naice_blog",
        defaultUsername: "naice",
        defaultPassword: "123456"
      },
      EMAIL: { service: "QQ", account: "xxxxx@xx.com", password: "xxxx" },
      BAIDU: { site: "blog.naice.me", token: "xxxxxxx" },
      APP: { ROOT_PATH: "/api", LIMIT: 10, PORT: 3009 },
      INFO: {
        name: "by_blog",
        version: "1.0.0",
        author: "naice",
        site: "https://blog.naice.me",
        powered: ["Vue2", "Nuxt.js", "Node.js", "MongoDB", "koa", "Nginx"]
      }
    };
  },
  function(e, t) {
    e.exports = require("mongoose");
  },
  function(e, t) {
    e.exports = require("mongoose-paginate");
  },
  function(e, t) {
    e.exports = require("crypto");
  },
  function(e, t, r) {
    "use strict";
    const s = r(1),
      a = r(2),
      n = new s.Schema({
        title: { type: String, required: !0 },
        keyword: { type: String, required: !0 },
        descript: { type: String, required: !0 },
        tag: [{ type: s.Schema.Types.ObjectId, ref: "Tag" }],
        content: { type: String, required: !0 },
        editContent: { type: String, required: !0 },
        state: { type: Number, default: 1 },
        publish: { type: Number, default: 1 },
        thumb: String,
        type: { type: Number, default: 1 },
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: Date.now },
        meta: {
          views: { type: Number, default: 0 },
          likes: { type: Number, default: 0 },
          comments: { type: Number, default: 0 }
        }
      });
    n.plugin(a),
      n.pre("findOneAndUpdate", function(e) {
        this.findOneAndUpdate({}, { update_at: Date.now() }), e();
      });
    const i = s.model("Article", n);
    e.exports = i;
  },
  function(e, t) {
    e.exports = {
      resError: ({ ctx: e, message: t = "请求失败", err: r = null }) => {
        e.body = { code: 0, message: t, debug: r };
      },
      resSuccess: ({ ctx: e, message: t = "请求成功", result: r = null }) => {
        e.body = { code: 1, message: t, result: r };
      }
    };
  },
  function(e, t, r) {
    "use strict";
    e.exports = e => async (t, r) => {
      const { body: s } = t.request;
      if (e && e.length > 0) {
        let r = [];
        for (let t = 0; t < e.length; t++) {
          let a = e[t];
          s.hasOwnProperty(a) || r.push(a);
        }
        r.length > 0 && t.throw(412, `${r.join(", ")} 参数缺失`);
      }
      await r();
    };
  },
  function(e, t, r) {
    "use strict";
    r(8);
  },
  function(e, t, r) {
    "use strict";
    const s = r(9),
      a = r(0),
      n = r(10),
      i = r(16),
      o = r(23),
      c = new s();
    n(),
      i(c),
      c.use(o.routes()),
      c.use(o.allowedMethods()),
      c.listen(a.APP.PORT, () => {
        console.log(`node-Koa Run！port at ${a.APP.PORT}`);
      });
  },
  function(e, t) {
    e.exports = require("koa");
  },
  function(e, t, r) {
    "use strict";
    (function(t) {
      const s = r(11),
        a = r(1),
        n = r(2),
        { resolve: i } = r(12),
        o = r(0),
        c = r(13),
        u = o.MONGODB.uri;
      (a.Promise = global.Promise),
        a.set("debug", !0),
        s.sync(i(t, "../models/*.js")).forEach(r(15)),
        (e.exports = function() {
          return (
            a.connect(u),
            a.connection.on("error", e => {
              console.log("数据库连接失败!", e);
            }),
            a.connection.once("open", () => {
              console.log("数据库连接成功!"),
                (n.paginate.options = { limit: o.APP.LIMIT }),
                c();
            }),
            a
          );
        });
    }.call(this, "/"));
  },
  function(e, t) {
    e.exports = require("glob");
  },
  function(e, t) {
    e.exports = require("path");
  },
  function(e, t, r) {
    "use strict";
    const s = r(3),
      a = r(0),
      n = r(14);
    e.exports = async () => {
      const e = a.User.defaultUsername,
        t = (e =>
          s
            .createHash("md5")
            .update(e)
            .digest("hex"))(a.User.defaultPassword);
      let r = await n
        .find({})
        .exec()
        .catch(e => {
          console.log(500, "服务器内部错误-查找admin错误！");
        });
      if ((console.log(r), 0 === r.length)) {
        let r = new n({ username: e, password: t, role: 100 });
        await r.save().catch(e => {
          console.log(500, "服务器内部错误-存储admin错误！");
        });
      }
    };
  },
  function(e, t, r) {
    const s = r(1),
      a = r(3),
      n = r(0),
      i = new s.Schema({
        name: { type: String, default: "naice" },
        username: { type: String, default: n.User.defaultUsername },
        slogan: { type: String, default: "" },
        gravatar: { type: String, default: "" },
        password: {
          type: String,
          default: a
            .createHash("md5")
            .update(n.User.defaultPassword)
            .digest("hex")
        },
        role: { type: Number, default: 1 }
      }),
      o = s.model("User", i);
    e.exports = o;
  },
  function(e, t) {
    function r(e) {
      var t = new Error("Cannot find module '" + e + "'");
      throw ((t.code = "MODULE_NOT_FOUND"), t);
    }
    (r.keys = function() {
      return [];
    }),
      (r.resolve = r),
      (e.exports = r),
      (r.id = 15);
  },
  function(e, t, r) {
    "use strict";
    const s = r(17),
      a = r(18),
      n = r(19);
    r(20);
    e.exports = e => {
      e.use(async (e, t) => {
        const r = new Date();
        await t();
        const s = new Date() - r;
        console.log(`${e.method} ${e.url} - ${s}ms`);
      }),
        e.use(n({ origin: "*" })),
        e.use(a()),
        e.use(s({ jsoinLimit: "10mb", formLimit: "10mb", textLimit: "10mb" })),
        e.use(async (e, t) => {
          try {
            await t();
          } catch (t) {
            e.body = { error: t };
          }
          (404 !== e.status && 405 !== e.status) ||
            (e.body = { code: 0, message: "无效的api请求" });
        });
    };
  },
  function(e, t) {
    e.exports = require("koa-bodyparser");
  },
  function(e, t) {
    e.exports = require("koa-helmet");
  },
  function(e, t) {
    e.exports = require("koa-cors");
  },
  function(e, t, r) {
    "use strict";
    const s = r(21);
    e.exports = async (e, t) => {
      const r = e.request.headers.origin || "";
      if (
        (([
          "https://blog.naice.me",
          "https://blog.admin.naice.me",
          "file://"
        ].includes(r) ||
          r.includes("localhost")) &&
          e.set("Access-Control-Allow-Origin", r),
        e.set({
          "Access-Control-Allow-Headers":
            "Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With",
          "Access-Control-Allow-Methods": "PUT,PATCH,POST,GET,DELETE,OPTIONS",
          "Access-Control-Max-Age": "1728000",
          "Content-Type": "application/json;charset=utf-8",
          "X-Powered-By": "naice_blog 1.0.0"
        }),
        "OPTIONS" == e.request.method)
      )
        return (e.status = 200), !1;
      if (Object.is("development", "production")) {
        const { origin: t, referer: r } = e.request.headers;
        if ("file://" !== t) {
          if (
            !((!t || t.includes("naice.me")) && (!r || r.includes("naice.me")))
          )
            return e.throw(403, { code: 0, message: "身份验证失败！" }), !1;
        }
      }
      const a =
          e.request.url.indexOf("/article/like") >= 0 &&
          Object.is(e.request.method, "POST"),
        n =
          e.request.url.indexOf("/comment/like") >= 0 &&
          Object.is(e.request.method, "POST"),
        i =
          e.request.url.indexOf("/user/login") >= 0 &&
          Object.is(e.request.method, "POST"),
        o =
          Object.is(e.request.url, "/api/hero/add") &&
          Object.is(e.request.method, "PUT"),
        c =
          Object.is(e.request.url, "/api/comment/add") &&
          Object.is(e.request.method, "PUT"),
        u =
          Object.is(e.request.url, "/api/reply/add") &&
          Object.is(e.request.method, "PUT");
      return a || n || c || i || o || u
        ? (await t(), !1)
        : s(e.request) || Object.is(e.request.method, "GET")
        ? void (await t())
        : (e.throw(401, { code: -2, message: "身份验证失败！" }), !1);
    };
  },
  function(e, t, r) {
    "use strict";
    const s = r(0),
      a = r(22);
    e.exports = e => {
      const t = (e => {
        if (e.headers && e.headers.authorization) {
          const t = e.headers.authorization.split(" ");
          if (Object.is(t.length, 2) && Object.is(t[0], "Naice")) return t[1];
        }
        return !1;
      })(e);
      if (t)
        try {
          if (
            a.verify(t, s.User.jwtTokenSecret).exp >
            Math.floor(Date.now() / 1e3)
          )
            return !0;
        } catch (e) {
          console.log(e);
        }
      return !1;
    };
  },
  function(e, t) {
    e.exports = require("jsonwebtoken");
  },
  function(e, t, r) {
    const s = r(24),
      a = r(25),
      n = r(27),
      i = new s();
    a(i), n(i), (e.exports = i);
  },
  function(e, t) {
    e.exports = require("koa-router");
  },
  function(e, t, r) {
    "use strict";
    const s = r(0),
      {
        putArticle: a,
        delectArticle: n,
        editeArticle: i,
        getArticleById: o,
        getArticles: c,
        changeArticleStatus: u,
        getAllArticles: d,
        likeArticle: l
      } = r(26),
      { resError: p, resSuccess: g } = r(5),
      m = r(6),
      f = e => `${s.APP.ROOT_PATH}/article/${e}`;
    e.exports = function(e) {
      e.put(
        f("add"),
        m(["title", "tag", "content", "editContent", "keyword", "descript"]),
        async (e, t) => {
          e.body = "hello";
          const r = e.request.body;
          await a(r);
          g({ ctx: e, message: "添加文章成功" });
        }
      ),
        e.get(f("get"), async (e, t) => {
          const r = e.query || {},
            s = await c(r);
          g({ ctx: e, message: "查询文章成功", result: s });
        }),
        e.get(f("get/:id"), async (e, t) => {
          const { id: r } = e.params;
          if (r)
            try {
              const t = await o(r);
              g({ ctx: e, message: "查询文章成功", result: t });
            } catch (t) {
              p({ ctx: e, message: "查询文章失败", err: t });
            }
          else p({ ctx: e, message: "查询文章失败", err: "缺少参数id" });
        }),
        e.del(f("delect/:id"), async (e, t) => {
          const { id: r } = e.params;
          if (r)
            try {
              await n(r);
              g({ ctx: e, message: "删除文章成功" });
            } catch (t) {
              p({ ctx: e, message: "删除文章失败", err: t });
            }
          else p({ ctx: e, message: "删除文章失败", err: "缺少参数id" });
        }),
        e.del(f("edite/:id"), async (e, t) => {
          const { id: r } = e.params;
          if (r)
            try {
              await i(r, e.request.body);
              g({ ctx: e, message: "修改文章成功" });
            } catch (t) {
              p({ ctx: e, message: "修改文章失败", err: t });
            }
          else p({ ctx: e, message: "修改文章失败", err: "地址缺少参数id" });
        }),
        e.get(f("getAll"), async (e, t) => {
          const r = await d();
          g({ ctx: e, message: "获取文章成功", result: r });
        }),
        e.post(f("status/:id"), async (e, t) => {
          const { id: r } = e.params;
          if (r)
            try {
              await u(r, e.request.body);
              g({ ctx: e, message: "修改文章状态成功" });
            } catch (t) {
              p({ ctx: e, message: "修改文章状态失败", err: t });
            }
          else
            p({ ctx: e, message: "修改文章状态失败", err: "地址缺少参数id" });
        }),
        e.post(f("like/:id"), async function(e, t) {
          const { id: r } = e.params;
          if (r)
            try {
              await l(r), g({ ctx: e, message: "修改成功" });
            } catch (t) {
              p({ ctx: e, message: "修改失败", err: t });
            }
          else p({ ctx: e, message: "修改失败", err: "地址缺少参数id" });
        });
    };
  },
  function(e, t, r) {
    "use strict";
    const s = r(4);
    e.exports = {
      putArticle: async e => {
        let t = null;
        return e && (t = await new s(e).save()), t;
      },
      delectArticle: async e => await s.findByIdAndRemove(e),
      editeArticle: async (e, t) => await s.findByIdAndUpdate(e, t),
      getArticleById: async e => {
        let t = await s.findById(e).populate("tag");
        return t && ((t.meta.views += 1), (t = await t.save())), t;
      },
      getArticles: async e => {
        const {
            current_page: t = 1,
            page_size: r = 10,
            keyword: a = "",
            state: n = 1,
            publish: i = 1,
            tag: o,
            type: c,
            date: u,
            hot: d
          } = e,
          l = {
            sort: { create_at: -1 },
            page: Number(t),
            limit: Number(r),
            populate: ["tag"],
            select: "-content"
          },
          p = {};
        if (a) {
          const e = new RegExp(a);
          p.$or = [{ title: e }, { content: e }, { description: e }];
        }
        if (
          (["1", "2"].includes(n) && (p.state = n),
          ["1", "2"].includes(i) && (p.publish = i),
          ["1", "2", "3"].includes(c) && (p.type = c),
          d &&
            (l.sort = {
              "meta.views": -1,
              "meta.likes": -1,
              "meta.comments": -1
            }),
          u)
        ) {
          const e = new Date(u);
          Object.is(e.toString(), "Invalid Date") ||
            (p.create_at = {
              $gte: new Date(1e3 * (e / 1e3 - 28800)),
              $lt: new Date(1e3 * (e / 1e3 + 57600))
            });
        }
        o && (p.tag = o);
        const g = await s.paginate(p, l);
        return (
          !!g && {
            pagination: {
              total: g.total,
              current_page: g.page,
              total_page: g.pages,
              page_size: g.limit
            },
            list: g.docs
          }
        );
      },
      changeArticleStatus: async (e, t) => {
        const { state: r, publish: a } = t,
          n = {};
        return (
          r && (n.state = r),
          a && (n.publish = a),
          await s.findByIdAndUpdate(e, n)
        );
      },
      likeArticle: async e => {
        let t = await s.findById(e);
        return t && ((t.meta.likes += 1), (t = await t.save())), t;
      },
      getAllArticles: async () => {
        Number(1), Number(1e4);
        const e = await s.aggregate([
          { $match: { state: 1, publish: 1 } },
          {
            $project: {
              year: { $year: "$create_at" },
              month: { $month: "$create_at" },
              title: 1,
              create_at: 1
            }
          },
          {
            $group: {
              _id: { year: "$year", month: "$month" },
              article: {
                $push: { title: "$title", _id: "$_id", create_at: "$create_at" }
              }
            }
          }
        ]);
        if (e) {
          return [...new Set(e.map(e => e._id.year))].map(t => {
            let r = [];
            return (
              e.forEach(e => {
                e._id.year === t &&
                  r.push({
                    month: e._id.month,
                    articleList: e.article.reverse()
                  });
              }),
              { year: t, monthList: r }
            );
          });
        }
        return [];
      }
    };
  },
  function(e, t, r) {
    "use strict";
    const s = r(0),
      { putTag: a, getTags: n, editTag: i, deleteTag: o } = r(28),
      { resError: c, resSuccess: u } = r(5),
      d = r(6),
      l = e => `${s.APP.ROOT_PATH}/tag/${e}`;
    e.exports = function(e) {
      e.put(l("add"), d(["name"]), async e => {
        const { name: t, descript: r = "" } = e.request.body;
        try {
          const s = await a({ name: t, descript: r });
          u({ ctx: e, message: "添加标签成功", result: s });
        } catch (t) {
          c({ ctx: e, message: "添加标签失败", err: t.message });
        }
      }),
        e.get(l("get"), async e => {
          try {
            let t = await n();
            u({ ctx: e, message: "获取标签成功", result: t });
          } catch (t) {
            c({ ctx: e, message: "获取标签失败", err: t });
          }
        }),
        e.del(l("delect/:id"), async e => {
          const { id: t } = e.params;
          if (t)
            try {
              await o(t), u({ ctx: e, message: "删除标签成功" });
            } catch (t) {
              c({ ctx: e, message: "删除标签失败", err: t });
            }
          else c({ ctx: e, message: "删除标签失败", err: "缺少参数id" });
        }),
        e.post(l("edit"), d(["_id", "name"]), async e => {
          try {
            await i(e.request.body);
            u({ ctx: e, message: "修改标签成功" });
          } catch (t) {
            c({ ctx: e, message: "修改标签失败", err: t });
          }
        });
    };
  },
  function(e, t, r) {
    "use strict";
    const s = r(29),
      a = r(4);
    e.exports = {
      putTag: async e => {
        const { name: t } = e,
          r = await s.find({ name: t });
        if (r && 0 !== r.length) throw new Error("标签名已经存在");
        return (await new s(e)).save();
      },
      getTags: async (e = {}) => {
        const { current_page: t = 1, page_size: r = 50, keyword: n = "" } = e,
          i = { sort: { sort: 1 }, page: Number(t), limit: Number(r) };
        let o = {};
        n && (o.name = new RegExp(n));
        let c = [];
        const u = await s.paginate(o, i);
        if (u) {
          let e = JSON.parse(JSON.stringify(u)),
            t = {};
          const r = await a.aggregate([
            { $match: t },
            { $unwind: "$tag" },
            { $group: { _id: "$tag", num_tutorial: { $sum: 1 } } }
          ]);
          r &&
            (e.docs.forEach(e => {
              const t = r.find(t => String(t._id) === String(e._id));
              e.count = t ? t.num_tutorial : 0;
            }),
            (c = {
              pagination: {
                total: e.total,
                current_page: e.page,
                total_page: e.pages,
                page_size: e.limit
              },
              list: e.docs
            }));
        }
        return c;
      },
      editTag: async e => {
        const { _id: t, name: r, descript: a } = e;
        return await s.findByIdAndUpdate(
          t,
          { name: r, descript: a },
          { new: !0 }
        );
      },
      deleteTag: async e => await s.findByIdAndRemove(e)
    };
  },
  function(e, t, r) {
    "use strict";
    const s = r(1),
      a = r(2),
      n = new s.Schema({
        name: { type: String, required: !0, validate: /\S+/ },
        descript: String,
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date },
        sort: { type: Number, default: 0 }
      });
    n.plugin(a),
      n.pre("findOneAndUpdate", function(e) {
        this.findOneAndUpdate({}, { update_at: Date.now() }), e();
      }),
      (e.exports = s.model("Tag", n));
  }
]);

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


! function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports, require("echarts")) : "function" == typeof define && define.amd ? define(["exports", "echarts"], e) : e(t.bmap = {}, t.echarts)
}(this, function (t, o) {
  "use strict";

  function f(t, e) {
    this._bmap = t, this.dimensions = ["lng", "lat"], this._mapOffset = [0, 0], this._api = e, this._projection = new BMap.MercatorProjection
  }

  function n(a, r) {
    return r = r || [0, 0], o.util.map([0, 1], function (t) {
      var e = r[t],
        o = a[t] / 2,
        n = [],
        i = [];
      return n[t] = e - o, i[t] = e + o, n[1 - t] = i[1 - t] = r[1 - t], Math.abs(this.dataToPoint(n)[t] - this.dataToPoint(i)[t])
    }, this)
  }
  var l;
  f.prototype.dimensions = ["lng", "lat"], f.prototype.setZoom = function (t) {
    this._zoom = t
  }, f.prototype.setCenter = function (t) {
    this._center = this._projection.lngLatToPoint(new BMap.Point(t[0], t[1]))
  }, f.prototype.setMapOffset = function (t) {
    this._mapOffset = t
  }, f.prototype.getBMap = function () {
    return this._bmap
  }, f.prototype.dataToPoint = function (t) {
    var e = new BMap.Point(t[0], t[1]),
      o = this._bmap.pointToOverlayPixel(e),
      n = this._mapOffset;
    return [o.x - n[0], o.y - n[1]]
  }, f.prototype.pointToData = function (t) {
    var e = this._mapOffset;
    return [(t = this._bmap.overlayPixelToPoint({
      x: t[0] + e[0],
      y: t[1] + e[1]
    })).lng, t.lat]
  }, f.prototype.getViewRect = function () {
    var t = this._api;
    return new o.graphic.BoundingRect(0, 0, t.getWidth(), t.getHeight())
  }, f.prototype.getRoamTransform = function () {
    return o.matrix.create()
  }, f.prototype.prepareCustoms = function (t) {
    var e = this.getViewRect();
    return {
      coordSys: {
        type: "bmap",
        x: e.x,
        y: e.y,
        width: e.width,
        height: e.height
      },
      api: {
        coord: o.util.bind(this.dataToPoint, this),
        size: o.util.bind(n, this)
      }
    }
  }, f.dimensions = f.prototype.dimensions, f.create = function (t, m) {
    var c, d = m.getDom();
    t.eachComponent("bmap", function (t) {
      var e = m.getZr().painter,
        o = e.getViewportRoot();
      if ("undefined" == typeof BMap) throw new Error("BMap api is not loaded");
      if (l = l || function () {
          function t(t) {
            this._root = t
          }
          return (t.prototype = new BMap.Overlay).initialize = function (t) {
            return t.getPanes().labelPane.appendChild(this._root), this._root
          }, t.prototype.draw = function () {}, t
        }(), c) throw new Error("Only one bmap component can exist");
      if (!t.__bmap) {
        var n = d.querySelector(".ec-extension-bmap");
        n && (o.style.left = "0px", o.style.top = "0px", d.removeChild(n)), (n = document.createElement("div")).style.cssText = "width:100%;height:100%", n.classList.add("ec-extension-bmap"), d.appendChild(n);
        var i = t.__bmap = new BMap.Map(n, {
            enableMapClick: false
          }),
          a = new l(o);
        i.addOverlay(a), e.getViewportRootOffset = function () {
          return {
            offsetLeft: 0,
            offsetTop: 0
          }
        }
      }
      i = t.__bmap;
      var r = t.get("center"),
        p = t.get("zoom");
      if (r && p) {
        var s = new BMap.Point(r[0], r[1]);
        i.centerAndZoom(s, p)
      }(c = new f(i, m)).setMapOffset(t.__mapOffset || [0, 0]), c.setZoom(p), c.setCenter(r), t.coordinateSystem = c
    }), t.eachSeries(function (t) {
      "bmap" === t.get("coordinateSystem") && (t.coordinateSystem = c)
    })
  }, o.extendComponentModel({
    type: "bmap",
    getBMap: function () {
      return this.__bmap
    },
    setCenterAndZoom: function (t, e) {
      this.option.center = t, this.option.zoom = e
    },
    centerOrZoomChanged: function (t, e) {
      var o = this.option;
      return !(function (t, e) {
        return t && e && t[0] === e[0] && t[1] === e[1]
      }(t, o.center) && e === o.zoom)
    },
    defaultOption: {
      center: [104.114129, 37.550339],
      zoom: 5,
      mapStyle: {},
      roam: !1
    }
  }), o.extendComponentView({
    type: "bmap",
    render: function (i, t, a) {
      function e(t, e) {
        if (!r) {
          var o = p.parentNode.parentNode.parentNode,
            n = [-parseInt(o.style.left, 10) || 0, -parseInt(o.style.top, 10) || 0];
          p.style.left = n[0] + "px", p.style.top = n[1] + "px", s.setMapOffset(n), i.__mapOffset = n, a.dispatchAction({
            type: "bmapRoam"
          })
        }
      }
      var r = !0,
        o = i.getBMap(),
        p = a.getZr().painter.getViewportRoot(),
        s = i.coordinateSystem;

      function n() {
        r || a.dispatchAction({
          type: "bmapRoam"
        })
      }
      o.removeEventListener("moving", this._oldMoveHandler), o.removeEventListener("zoomend", this._oldZoomEndHandler), o.addEventListener("moving", e), o.addEventListener("zoomend", n), this._oldMoveHandler = e, this._oldZoomEndHandler = n;
      var m = i.get("roam");
      m && "scale" !== m ? o.enableDragging() : o.disableDragging(), m && "move" !== m ? (o.enableScrollWheelZoom(), o.enableDoubleClickZoom(), o.enablePinchToZoom()) : (o.disableScrollWheelZoom(), o.disableDoubleClickZoom(), o.disablePinchToZoom());
      var c = i.__mapStyle,
        d = i.get("mapStyle") || {},
        f = JSON.stringify(d);
      JSON.stringify(c) !== f && (Object.keys(d).length && o.setMapStyle(d), i.__mapStyle = JSON.parse(f)), r = !1
    }
  }), o.registerCoordinateSystem("bmap", f), o.registerAction({
    type: "bmapRoam",
    event: "bmapRoam",
    update: "updateLayout"
  }, function (t, e) {
    e.eachComponent("bmap", function (t) {
      var e = t.getBMap(),
        o = e.getCenter();
      t.setCenterAndZoom([o.lng, o.lat], e.getZoom())
    })
  });
  t.version = "1.0.0"
});
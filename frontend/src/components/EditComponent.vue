// EditComponent.vue

<template>
  <div class="columns">
        <div class="column is-2">
            <div>
                Search String<input type="text" id="searchString">
                <button class="button is-primary is-small" id="searchElementBt" onclick="searchElement()" >Search</button>
            </div>
            <div>
                x: <input type="text" id="xText" value=0 maxlength="3" size="3">
                y: <input type="text" id="yText" value=0 maxlength="3" size="3">
            </div>
            <div>
                Strip ID: <input type="text" id="stripIdText" value="..." maxlength="8" size="8">
            </div>
            <div>
                TT ID: <input type="text" id="ttIdText" value="..." maxlength="3" size="3">
            </div>
            <div>
                TCC ID: <input type="text" id="tccIdText" value="..." maxlength="3" size="3">
            </div>
            <div>
                FED ID: <input type="text" id="fedIdText" value="..." maxlength="3" size="3">
            </div>
            <div>
                Eta ring ID: <input type="text" id="etaringIdText" value="..." maxlength="3" size="3">
            </div>
            <div>
                TT Eta ring ID: <input type="text" id="ttetaringIdText" value="..." maxlength="3" size="3">
            </div>
            <label class="checkbox">
                <input type="checkbox" id="showFEDborders" @change="toggleBorders()">
                FED borders
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showTCCborders" @change="toggleBorders()">
                TCC borders
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showTRborders" @change="toggleBorders()">
                TR borders
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showETARingArea" checked>
                ETA Ring area
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showTTETARingArea" >
                TT ETA Ring area
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showFEDArea" checked>
                FED area
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showTCCArea" checked>
                TCC area
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showTTArea" checked>
                TT area
            </label>
            <label class="checkbox">
                <input type="checkbox" id="showStripArea" checked>
                Strip area
            </label>
            <button class="button is-primary" id="loadHisto" @click="addplot()" >Add histo</button>
            <div>
                Run number<input type="text" id="dqmLinkText" v-model="runNumber">
            </div>
            <modal name="ask-password"
                  :width="300"
                  :height="130">
              <div class="columns is-centered">
                <div class="column is-8">
                  <div class="field">
                    <label class="label">Access to DQM:</label>
                    <div class="control">
                      <input class="input" type="password" placeholder="Password" id="n-password2" v-model="dqmpass">
                    </div>
                  </div>
                  <div>
                    <div class="button-set">
                      <button class="button is-link" id="continue-btn" @click="continueAddPlot()">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </modal>
        </div>
        <div id="grid" class="column"></div>
    </div>
</template>

<script>
  import * as d3 from "d3";
  
  // import $ from "jquery";
  export default {

    data () {
      return {
        width: 6,
        height: 6,
        original_crystals_map: [],
        modified_crystals_map: [],
        border_map: {},
        grid: 0,
        dqmpass: "",
        runNumber: 327483 // Just a run for testing. It should be the actual run. 
      };
    },

    methods: {
    
      gridData() {
        //var startColor = 0x000000;
        for (let i in this.original_crystals_map) {
          let crystal = this.original_crystals_map[i]
          if(crystal.side>0){
            this.modified_crystals_map.push({
              x: ((crystal.ix - 1) * this.width) +1,
              y: ((crystal.iy - 1) * this.height) +1,
              width: this.width,
              height: this.height,
              info: crystal,
              bg: "#2C93E8",
              bg_store: "#2C93E8"
            });
          }
        }
      },

      buildBorders() {

        for (let i in this.original_crystals_map) {
          let crystal = this.original_crystals_map[i]
          if(crystal.side>0){
            let xcrystal = ((crystal.ix - 1) * this.width) +1
            let ycrystal = ((crystal.iy - 1) * this.height) +1
            let line1 = [xcrystal,ycrystal+this.height,xcrystal+this.width,ycrystal+this.height].join()
            let line2 = [xcrystal+this.width,ycrystal,xcrystal+this.width,ycrystal+this.height].join()
            let line3 = [xcrystal,ycrystal,xcrystal+this.width,ycrystal].join()
            let line4 = [xcrystal,ycrystal,xcrystal,ycrystal+this.height].join()

            let common_part = {'TCCb':0, 'FEDb':0, 'TRb':0, 'width':0.5, 'stroke': 'black'};

            this.border_map[line1] = Object.assign({}, {'x1':xcrystal,'y1':ycrystal+this.height,'x2':xcrystal+this.width,'y2':ycrystal+this.height}, common_part);
            this.border_map[line2] = Object.assign({}, {'x1':xcrystal+this.width,'y1':ycrystal,'x2':xcrystal+this.width,'y2':ycrystal+this.height}, common_part);
            this.border_map[line3] = Object.assign({}, {'x1':xcrystal,'y1':ycrystal,'x2':xcrystal+this.width,'y2':ycrystal}, common_part);
            this.border_map[line4] = Object.assign({}, {'x1':xcrystal,'y1':ycrystal,'x2':xcrystal,'y2':ycrystal+this.height}, common_part);

            if(crystal.TCCb & 0x1) {
              this.border_map[line1]['TCCb'] = 1;
            }
            if(crystal.TCCb & 0x2) {
              this.border_map[line2]['TCCb'] = 1;
            }
            if(crystal.TCCb & 0x4) {
              this.border_map[line3]['TCCb'] = 1;
            }
            if(crystal.TCCb & 0x8) {
              this.border_map[line4]['TCCb'] = 1;
            }

            if(crystal.FEDb & 0x1) {
              this.border_map[line1]['FEDb'] = 1;
            }
            if(crystal.FEDb & 0x2) {
              this.border_map[line2]['FEDb'] = 1;
            }
            if(crystal.FEDb & 0x4) {
              this.border_map[line3]['FEDb'] = 1;
            }
            if(crystal.FEDb & 0x8) {
              this.border_map[line4]['FEDb'] = 1;
            }

            if(crystal.TRb & 0x1) {
              this.border_map[line1]['TRb'] = 1;
            }
            if(crystal.TRb & 0x2) {
              this.border_map[line2]['TRb'] = 1;
            }
            if(crystal.TRb & 0x4) {
              this.border_map[line3]['TRb'] = 1;
            }
            if(crystal.TRb & 0x8) {
              this.border_map[line4]['TRb'] = 1;
            }

          }
        }

      },

      mouseOverCallback(d) {
        document.getElementById("xText").value = d.info.ix;
        document.getElementById("yText").value = d.info.iy;
        document.getElementById("stripIdText").value = d.info.stripid;
        document.getElementById("ttIdText").value = d.info.TTinTCC;			
        document.getElementById("tccIdText").value = d.info.TCC;
        document.getElementById("fedIdText").value = d.info.FED;
        document.getElementById("etaringIdText").value = d.info.eta_ring;
        document.getElementById("ttetaringIdText").value = d.info.TTeta_ring;

        this.cycleOnAllCrystals(d)

        this.grid.selectAll(".square").data(this.modified_crystals_map).style("fill", function(d) { return d.bg; })
      },

      cycleOnAllCrystals(d) {
        for(let i in this.modified_crystals_map){
          let el = this.modified_crystals_map[i]
          el.bg = el.bg_store;
          if (el.info.eta_ring == d.info.eta_ring && document.getElementById("showETARingArea").checked) {
            el.bg = "#99FDEB"
          }
          if (el.info.TTeta_ring == d.info.TTeta_ring && document.getElementById("showTTETARingArea").checked) {
            el.bg = "#99FDEB"
          }
          if (el.info.FED == d.info.FED && document.getElementById("showFEDArea").checked) {
            el.bg = "#FFECC8"
          }
          if (el.info.TCC == d.info.TCC) {
            if (el.info.TTinTCC == d.info.TTinTCC && document.getElementById("showTTArea").checked) {
              el.bg = "#996600"
            } else if (document.getElementById("showTCCArea").checked){
              el.bg = "#FFBA32"
            }
          }
          if (el.info.stripid == d.info.stripid && document.getElementById("showStripArea").checked) {
            el.bg = "#FF0000"
          }
        }
      },

      cycleAllBorders() {
        for(let i in this.border_map){
          let el = this.border_map[i]
          el.width = 0.5;
          el.stroke = "black";
          if (el['TRb'] && document.getElementById("showTRborders").checked) { 
            el.stroke = "red";
            el.width = 1.5;
          }
          if (el['TCCb'] && document.getElementById("showTCCborders").checked) el.width = 1.5;
          if (el['FEDb'] && document.getElementById("showFEDborders").checked) el.width = 3;
        }
      },

      toggleBorders() {
        this.cycleAllBorders()
        this.grid.selectAll(".border")
          .data(Object.keys(this.border_map))
          .style("stroke-width", (d) => { return this.border_map[d]['width']; })
          .style("stroke", (d) => { return this.border_map[d]['stroke']; })
      },


      addplot() {
        this.$modal.show('ask-password');
      },

      continueAddPlot() {
        // var newLink = "https://cmsweb.cern.ch/dqm/online/jsonfairy/archive/327483/Global/Online/ALL/EcalEndcap/EEOccupancyTask/EEOT digi occupancy EE +"
        
        this.axios.post("http://localhost:4000/posts/getroot", {dqmpass: this.dqmpass}).then((response) => {

          if (response.data.data == 'error') {
            return
          }

          var thejsonhist = response.data.data.hist

          //var thejsonhist = JSON.parse(myhist)
          let rows = thejsonhist.bins.content
          var histomap = {};
          var counter_rows = 0;
          var histowidth = 0
          var histoheight = 0
          var counter_columns = 0;
          var maxScaleVal = 0;

          var nuberofpointsx = thejsonhist.xaxis.last.value / thejsonhist.xaxis.last.id
          var nuberofpointsy = thejsonhist.yaxis.last.value / thejsonhist.yaxis.last.id
          histowidth = this.width*nuberofpointsx;
          histoheight = this.height*nuberofpointsy;
          _.forEach(rows, function(row){
            counter_columns = 0;
            _.forEach(row, function(value){
              if(value>maxScaleVal) maxScaleVal = value;
              histomap[[(counter_columns * histowidth) +1,(counter_rows * histoheight) +1]] = value
                counter_columns = counter_columns + 1;
              });
            counter_rows = counter_rows + 1;
          }); 
          
          var colorScale1 = d3.scaleSequential(d3.interpolatePlasma).domain([0, maxScaleVal]);

          // console.log(histomap)
          // console.log(counter_columns,counter_rows)
          _.forEach(this.modified_crystals_map, function(crystal) {
            let histox = parseInt(crystal.x / histowidth)*histowidth+1
            let histoy = parseInt(crystal.y / histoheight)*histoheight+1
            crystal['histoval'] = histomap[[histox,histoy]]
            crystal.bg_store = colorScale1(crystal.histoval)
            crystal.bg = colorScale1(crystal.histoval)
          })

          this.grid.selectAll(".square").data(this.modified_crystals_map).style("fill", function(d) { return d.bg; })
        })

        this.$modal.hide('ask-password')
        this.dqmpass = ""
      }
    },

    mounted () {

      this.axios.get("http://localhost:4000/posts/getcrystals").then((response) => {
        // handle success
        this.original_crystals_map = response.data.crystal_map
        this.gridData()
        this.buildBorders()

        this.grid = d3.select("#grid")
          .append("svg")
          .attr("width","1200px")
          .attr("height","1200px");
          
        var cell = this.grid.selectAll(".square")
          .data(this.modified_crystals_map)
          .enter().append("rect")
          .attr("class","square")
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("width", function(d) { return d.width; })
          .attr("height", function(d) { return d.height; })
          .style("fill", function(d) { return d.bg; })
          .on('mouseover', (d) => { 
              this.mouseOverCallback(d);
            });

        var border = this.grid.selectAll(".border")
          .data(Object.keys(this.border_map))
          .enter().append("line")
          .attr("class","border")
          .attr("x1", (d) => { return this.border_map[d]['x1']; })
          .attr("y1", (d) => { return this.border_map[d]['y1']; })
          .attr("x2", (d) => { return this.border_map[d]['x2']; })
          .attr("y2", (d) => { return this.border_map[d]['y2']; })
          .style("stroke-width", (d) => { return this.border_map[d]['width']; })
          .style("stroke", "black")
          .style("stroke-linecap","square");


        
      }).catch(function (error) {
        // handle error
        console.error(error);
      }).then(function () {
        // always executed
      });

      
    }

  }
</script>
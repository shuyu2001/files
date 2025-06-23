  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 通用：等待某个元素出现
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - startTime > timeout)
          return reject(new Error(`Timeout: ${selector}`));
        requestAnimationFrame(check);
      };

      check();
    });
  }

  async function waitAndClick(selector, timeout = 5000) {
    const el = await waitForElement(selector, timeout);
    el.click();
    return el;
  }

  const SELECTORS = {
    tableCheckbox:
      "#qc-pro-main-tools div:nth-child(3) .comment-table thead tr th.ovui-th--sticky-left div label div div",
    button1: "#qc-pro-main-tools div:nth-child(3) .top-btns button",
    modalConfirm:
      "body > div.ovui-modal__wrap.oc-modal-wrap .ovui-modal__footer button:nth-child(2)",
  };

  async function startJOB(keywords) {
    try {
      await waitForElement(SELECTORS.tableCheckbox);
      selectIndex(keywords);
      console.log("✅ 第一步：选择关键词完成");

      await sleep(1000);
      await waitAndClick(SELECTORS.button1);
      console.log("✅ 第二步：按钮1已点击");

      await sleep(1000);
      await waitAndClick(SELECTORS.modalConfirm);
      console.log("✅ 第三步：弹窗确认完成");

      console.log("🎉 所有自动化操作完成，页面即将刷新");
      location.reload();
    } catch (err) {
      console.error("❌ 自动化出错：", err.message);
    }
  }

  function selectIndex(keywords) {
    if (keywords.some((keyword) => keyword.trim() == "*")) {
      console.log("选中所有行");
      const c = document.querySelector(
        "#qc-pro-main-tools > div > div > div:nth-child(3) > div > div > div > div.oc-table-wrapper > div.ovui-table__container.comment-table > div.ovui-table__wrapper > table > thead > tr > th.ovui-th.ovui-th--sticky.ovui-th--sticky-left.ovui-table-cell.ovui-table-cell--center.ovui-th__no-left-border.ovui-th__no-bottom-border > div > label > div > div > div.ovui-icon.ovui-checkbox__checked-icon"
      );
      c.click();
      return;
    }

    const tds = document.querySelectorAll("table tbody tr");
    for (let i = 0; i < tds.length; i++) {
      const text = tds[i].querySelector("td:nth-child(2)").textContent.trim();
      if (keywords.some((keyword) => text.includes(keyword))) {
        const checkbox = tds[i].querySelector('input[type="checkbox"]');
        if (checkbox) {
          console.log("选中 ==>", text);
          sleep(200);
          checkbox.click();
        }
      }
    }
  }

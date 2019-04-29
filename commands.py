import sublime, sublime_plugin
import re

ss_interp_element = 'punctuation.definition.string.interpolated.element'
ss_template_literal = '(string.interpolated.es | meta.interpolation.syntax | entity.quasi.tag.name) - '+ss_interp_element+'.end.es'

r_directive = r'(\s*syntax:\s*)([\w\.]*)(\s*)'

class ToggleNestedSyntaxCommand(sublime_plugin.TextCommand):
  def behind(self, i_traverse, ss_behind, b_against=False):
    while i_traverse > 0 and self.view.match_selector(i_traverse, ss_behind): i_traverse -= 1
    if b_against: i_traverse += 1
    return i_traverse

  def over(self, i_traverse, ss_over):
    while self.view.match_selector(i_traverse, ss_over): i_traverse += 1
    return i_traverse

  def run(self, edit):
    d_view = self.view

    # ref selections
    a_sels = list(d_view.sel())

    # clear selections
    d_view.sel().clear()

    # cumulative gap
    c_gap = 0

    # each selection
    for y_cursor in a_sels:
      y_region = None

      # for multi-selection
      y_cursor.a += c_gap
      y_cursor.b += c_gap

      # traversal point
      i_traverse = i_cursor = y_cursor.begin()

      c_loops = 0

      # find beginning of interpolated string
      while d_view.match_selector(i_traverse, ss_template_literal):
        if c_loops > 15: break
        c_loops += 1

        # traverse beyond template literal
        i_traverse = self.behind(i_traverse, ss_template_literal)

        # reached bof
        if i_traverse == 0: break

        # boundary is interpolated element
        if d_view.match_selector(i_traverse, ss_interp_element+'.end.es'):
          # traverse over interpolated element
          while i_traverse > 0 and not d_view.match_selector(i_traverse, ss_interp_element+'.begin.es'):
            i_traverse -= 1

          # keep traversing
          continue

        # boundary is anything else; stop traversing
        else:
          break

      # start of template literal
      i_literal = i_traverse + 1

      # span whitespace and then block comment
      i_traverse = self.behind(i_traverse, 'meta.whitespace.es')
      i_traverse = self.behind(i_traverse, 'comment.block.es', True)

      # at block comment
      if d_view.match_selector(i_traverse, 'comment.block.es & meta.comment.border.es'):
        i_block = i_traverse

        # move forward past border
        i_traverse = self.over(i_traverse, 'meta.comment.border.es')
        
        # match syntax directive
        y_directive = d_view.find(r_directive, i_traverse)
        if y_directive is not None and not y_directive.empty() and y_directive.begin() < i_literal:
          # toggle off directive
          d_view.erase(edit, sublime.Region(i_block, i_literal))

          # calculate gap
          n_gap = i_literal - i_block

          # update cursor with offset
          y_cursor.a -= n_gap
          y_cursor.b -= n_gap

          c_gap -= n_gap

          # add cursor
          d_view.sel().add(y_cursor)

          # next selection
          continue;

      # pre region
      y_region_pre = sublime.Region(i_literal, i_cursor)

      # offset
      nl_offset = 0

      # pre text
      s_pre = d_view.substr(y_region_pre)
      nl_offset += len(s_pre)
      s_pre = re.sub(r'\$', r'\\$', s_pre);

      # selection
      s_sel = d_view.substr(y_cursor)
      nl_offset += len(s_sel)
      s_sel = "${0:"+re.sub(r'\$', r'\\$', s_sel)+"}"

      # auto-gobble upcoming insert_snippet's auto-indentation
      i_bol = d_view.expand_by_class(i_literal, sublime.CLASS_LINE_START).begin()
      s_line = d_view.substr(sublime.Region(i_bol, i_literal))
      m_gobble = re.match(r'^([ \t]*)', s_line)
      if m_gobble is not None:
        s_pre = re.sub(r'\n'+m_gobble.group(1), '\n', s_pre)

      # post text
      i_traverse = self.over(i_cursor, ss_template_literal)

      # update cursor
      y_cursor.b = y_cursor.end()
      y_cursor.a = i_literal

      # add cursor
      d_view.sel().add(y_cursor)

      # add directive
      s_dir = "/* syntax: ${1:language} */ "
      c_gap += len(s_dir) - 5
      s_snippet = s_dir+s_pre+s_sel

      # update cumulative gap
      c_gap += nl_offset

      # insert code
      d_view.run_command('insert_snippet', {"contents": s_snippet})



class InsertNestedSyntaxCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    d_view = self.view

    # ref selections
    a_sels = list(d_view.sel())

    # each selection
    for y_cursor in a_sels:
      y_region = None

      s_snippet = "/* syntax: ${1:language} */ `$0`"
      d_view.run_command('insert_snippet', {"contents": s_snippet})
